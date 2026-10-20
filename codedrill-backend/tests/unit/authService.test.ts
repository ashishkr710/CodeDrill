import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { authService } from '../../src/services/auth.service.js';
import { User } from '../../src/models/user.model.js';
import { RefreshToken } from '../../src/models/refreshToken.model.js';
import { ForbiddenError, UnauthorizedError } from '../../src/constants/errors.constant.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await RefreshToken.deleteMany({});
});

describe('AuthService - Authentication & Token Rotation', () => {
  it('should register a new user and generate access/refresh token pair', async () => {
    const result = await authService.register({
      email: 'priya@codedrill.dev',
      password: 'StrongPassword123!',
      displayName: 'Priya CS'
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.email).toBe('priya@codedrill.dev');

    const storedUser = await User.findById(result.user.id);
    expect(storedUser).not.toBeNull();
  });

  it('should login an existing user with valid password', async () => {
    await authService.register({
      email: 'carlos@codedrill.dev',
      password: 'PolyglotPassword!',
      displayName: 'Carlos Polyglot'
    });

    const loginResult = await authService.login({
      email: 'carlos@codedrill.dev',
      password: 'PolyglotPassword!'
    });

    expect(loginResult.accessToken).toBeDefined();
    expect(loginResult.refreshToken).toBeDefined();
    expect(loginResult.user.displayName).toBe('Carlos Polyglot');
  });

  it('should reject login with wrong password', async () => {
    await authService.register({
      email: 'sarah@codedrill.dev',
      password: 'CorrectPassword!',
      displayName: 'Sarah'
    });

    await expect(
      authService.login({
        email: 'sarah@codedrill.dev',
        password: 'WrongPassword!'
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should perform token rotation upon refresh', async () => {
    const authData = await authService.register({
      email: 'rotation@codedrill.dev',
      password: 'Password123!',
      displayName: 'Rotation Tester'
    });

    const initialRefreshToken = authData.refreshToken;

    // First rotation: valid
    const rotated = await authService.refreshTokens(initialRefreshToken);
    expect(rotated.accessToken).toBeDefined();
    expect(rotated.newRefreshToken).toBeDefined();
    expect(rotated.newRefreshToken).not.toBe(initialRefreshToken);

    // Initial refresh token should now be marked revoked
    const oldTokenDoc = await RefreshToken.findOne({ isRevoked: true });
    expect(oldTokenDoc).not.toBeNull();

    // The new token should be valid and share the same familyId
    const secondRotated = await authService.refreshTokens(rotated.newRefreshToken);
    expect(secondRotated.accessToken).toBeDefined();
    expect(secondRotated.newRefreshToken).toBeDefined();
  });

  it('should detect replay attack and revoke entire token family', async () => {
    const authData = await authService.register({
      email: 'victim@codedrill.dev',
      password: 'Password123!',
      displayName: 'Victim User'
    });

    const token1 = authData.refreshToken;

    // Normal client consumes token1 -> gets token2
    const rotation1 = await authService.refreshTokens(token1);
    const token2 = rotation1.newRefreshToken;

    // Attacker steals and presents already-consumed token1!
    await expect(authService.refreshTokens(token1)).rejects.toThrow(ForbiddenError);

    // Entire family should now be revoked; token2 is no longer valid
    await expect(authService.refreshTokens(token2)).rejects.toThrow(ForbiddenError);

    const activeTokens = await RefreshToken.find({ userId: authData.user.id, isRevoked: false });
    expect(activeTokens.length).toBe(0);
  });
});
