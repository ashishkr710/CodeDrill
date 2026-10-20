import { hash, verify, Algorithm } from '@node-rs/argon2';
import crypto from 'crypto';

/**
 * Hashes a plaintext password using Argon2id with production security parameters.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    algorithm: Algorithm.Argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 iterations
    parallelism: 4
  });
}

/**
 * Verifies a plaintext password against an Argon2id hash.
 */
export async function verifyPassword(hashString: string, candidate: string): Promise<boolean> {
  try {
    return await verify(hashString, candidate);
  } catch {
    return false;
  }
}

/**
 * Generates a SHA-256 hash of a token for storage in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a cryptographically secure random string.
 */
export function generateRandomToken(bytes = 40): string {
  return crypto.randomBytes(bytes).toString('hex');
}
