import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.util.js';
import { env } from '../config/env.config.js';
import { BadRequestError } from '../constants/errors.constant.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: '/api/v1/auth'
  });
}

function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth'
  });
}

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, displayName } = req.body;
      const result = await authService.register({ email, password, displayName });

      setRefreshTokenCookie(res, result.refreshToken);

      sendSuccess({
        res,
        statusCode: 201,
        data: {
          accessToken: result.accessToken,
          user: result.user
        },
        message: 'Account created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      setRefreshTokenCookie(res, result.refreshToken);

      sendSuccess({
        res,
        statusCode: 200,
        data: {
          accessToken: result.accessToken,
          user: result.user
        },
        message: 'Logged in successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

      if (!rawRefreshToken) {
        throw new BadRequestError('No refresh token provided in cookie or payload');
      }

      const result = await authService.refreshTokens(rawRefreshToken);

      setRefreshTokenCookie(res, result.newRefreshToken);

      sendSuccess({
        res,
        statusCode: 200,
        data: {
          accessToken: result.accessToken
        },
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

      if (rawRefreshToken) {
        await authService.logout(rawRefreshToken);
      }

      clearRefreshTokenCookie(res);

      sendSuccess({
        res,
        statusCode: 200,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new BadRequestError('User context not found');
      }

      const profile = await authService.getProfile(req.user.userId);

      sendSuccess({
        res,
        statusCode: 200,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
