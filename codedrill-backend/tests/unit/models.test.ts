import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../../src/models/user.model.js';
import { RefreshToken } from '../../src/models/refreshToken.model.js';
import { hashToken } from '../../src/utils/crypto.util.js';

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

describe('User Model', () => {
  it('should hash the password with Argon2 upon save', async () => {
    const user = new User({
      email: 'test@codedrill.dev',
      passwordHash: 'SuperSecret123!',
      displayName: 'TestArchitect'
    });

    await user.save();

    expect(user.passwordHash).toMatch(/^\$argon2id\$/);
    expect(await user.verifyPassword('SuperSecret123!')).toBe(true);
    expect(await user.verifyPassword('WrongPassword')).toBe(false);
  });

  it('should enforce unique lowercase email', async () => {
    await User.create({
      email: 'alex@codedrill.dev',
      passwordHash: 'Pass12345!',
      displayName: 'Alex'
    });

    let duplicateError: Error | null = null;
    try {
      await User.create({
        email: 'ALEX@codedrill.dev', // Uppercase variation
        passwordHash: 'AnotherPass123!',
        displayName: 'Alex 2'
      });
    } catch (err) {
      duplicateError = err as Error;
    }

    expect(duplicateError).not.toBeNull();
  });

  it('should exclude passwordHash in toJSON transform', async () => {
    const user = await User.create({
      email: 'json@codedrill.dev',
      passwordHash: 'PlainSecret!',
      displayName: 'JsonUser'
    });

    const json = user.toJSON();
    expect(json.passwordHash).toBeUndefined();
    expect(json.id).toBeDefined();
    expect(json.email).toBe('json@codedrill.dev');
  });
});

describe('RefreshToken Model', () => {
  it('should create and revoke token family on demand', async () => {
    const user = await User.create({
      email: 'tokenuser@codedrill.dev',
      passwordHash: 'Password123!',
      displayName: 'TokenUser'
    });

    const tokenHash1 = hashToken('random_token_string_1');
    const tokenHash2 = hashToken('random_token_string_2');
    const familyId = 'family-uuid-123';

    await RefreshToken.create([
      {
        userId: user._id,
        tokenHash: tokenHash1,
        familyId,
        expiresAt: new Date(Date.now() + 7 * 86400000)
      },
      {
        userId: user._id,
        tokenHash: tokenHash2,
        familyId,
        expiresAt: new Date(Date.now() + 7 * 86400000)
      }
    ]);

    // Verify initially not revoked
    const activeTokens = await RefreshToken.find({ familyId, isRevoked: false });
    expect(activeTokens.length).toBe(2);

    // Revoke family
    await RefreshToken.revokeFamily(user._id, familyId);

    const revokedTokens = await RefreshToken.find({ familyId, isRevoked: true });
    expect(revokedTokens.length).toBe(2);
  });
});
