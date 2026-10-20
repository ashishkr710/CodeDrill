import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { env } from '../config/env.config.js';
import { User, IUserDocument } from '../models/user.model.js';
import { RefreshToken } from '../models/refreshToken.model.js';
import { hashToken, generateRandomToken } from '../utils/crypto.util.js';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
} from '../constants/errors.constant.js';
import { AuthUserPayload } from '../@types/express.js';

export interface RegisterDTO {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: 'user' | 'admin';
    streak: {
      currentStreak: number;
      longestStreak: number;
      lastActiveDate: string | null;
    };
  };
}

export class AuthService {
  /**
   * Generates a signed short-lived JWT access token (15 minutes).
   */
  public generateAccessToken(user: IUserDocument): string {
    const payload: AuthUserPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRATION as jwt.SignOptions['expiresIn']
    });
  }

  /**
   * Verifies an access token JWT and returns its typed payload.
   */
  public verifyAccessToken(token: string): AuthUserPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUserPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Access token has expired', 'TOKEN_EXPIRED');
      }
      throw new UnauthorizedError('Invalid access token', 'TOKEN_INVALID');
    }
  }

  /**
   * Creates and persists a new refresh token family or continues an existing family.
   */
  public async createRefreshToken(
    userId: string,
    familyId: string = nanoid(16)
  ): Promise<{ rawToken: string; familyId: string }> {
    const rawToken = generateRandomToken(40);
    const tokenHash = hashToken(rawToken);

    // Calculate expiration: 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId,
      tokenHash,
      familyId,
      expiresAt,
      isRevoked: false
    });

    return { rawToken, familyId };
  }

  /**
   * Registers a new user account and returns the initial token pair.
   */
  public async register(dto: RegisterDTO): Promise<AuthTokens> {
    const existing = await User.findOne({ email: dto.email.toLowerCase().trim() });
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const user = new User({
      email: dto.email,
      passwordHash: dto.password, // Pre-save hook will hash with Argon2
      displayName: dto.displayName
    });

    await user.save();

    const accessToken = this.generateAccessToken(user);
    const { rawToken } = await this.createRefreshToken(user._id.toString());

    return {
      accessToken,
      refreshToken: rawToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        streak: user.streak
      }
    };
  }

  /**
   * Authenticates user with credentials and issues a fresh session token pair.
   */
  public async login(dto: LoginDTO): Promise<AuthTokens> {
    const user = await User.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.verifyPassword(dto.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.', 'INVALID_CREDENTIALS');
    }

    const accessToken = this.generateAccessToken(user);
    const { rawToken } = await this.createRefreshToken(user._id.toString());

    return {
      accessToken,
      refreshToken: rawToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        streak: user.streak
      }
    };
  }

  /**
   * Rotates a refresh token and generates a new access token.
   * Defends against replay attacks: if a revoked token is presented, the entire family is revoked.
   */
  public async refreshTokens(
    rawRefreshToken: string
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    if (!rawRefreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token.', 'TOKEN_INVALID');
    }

    // 1. REPLAY ATTACK DETECTION
    if (storedToken.isRevoked) {
      // Token was already consumed! Invalidate all tokens in this user family to protect account
      await RefreshToken.revokeFamily(storedToken.userId, storedToken.familyId);
      throw new ForbiddenError(
        'Session compromised: attempted token reuse detected. All sessions terminated.',
        'TOKEN_REUSE_DETECTED'
      );
    }

    // 2. Expiration check
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired.', 'TOKEN_EXPIRED');
    }

    // 3. Mark current token as consumed
    storedToken.isRevoked = true;
    await storedToken.save();

    // 4. Find user to sign new access token
    const user = await User.findById(storedToken.userId);
    if (!user) {
      throw new NotFoundError('User associated with token');
    }

    // 5. Issue new token pair preserving the familyId
    const newAccessToken = this.generateAccessToken(user);
    const { rawToken: newRefreshToken } = await this.createRefreshToken(
      user._id.toString(),
      storedToken.familyId
    );

    return {
      accessToken: newAccessToken,
      newRefreshToken
    };
  }

  /**
   * Logs out user by revoking the presented refresh token.
   */
  public async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) return;

    const tokenHash = hashToken(rawRefreshToken);
    await RefreshToken.updateOne({ tokenHash }, { $set: { isRevoked: true } });
  }

  /**
   * Retrieves profile for the authenticated user.
   */
  public async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }
    return user.toJSON();
  }
}

export const authService = new AuthService();
