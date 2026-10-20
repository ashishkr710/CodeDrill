import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables before validation
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Database Connection
  MONGODB_URI: z.string().default('mongodb://localhost:27017/codedrill'),

  // Authentication Secrets
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  // Sandbox Code Runner
  EXECUTION_SANDBOX_TYPE: z.enum(['judge0', 'piston', 'mock']).default('mock'),
  JUDGE0_API_URL: z.string().url().default('http://localhost:2358'),
  JUDGE0_API_KEY: z.string().optional().default(''),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(120),
  CODE_EXECUTION_MAX_PER_MINUTE: z.coerce.number().default(15)
});

export type EnvConfig = z.infer<typeof envSchema>;

function parseEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.format();
    console.error(
      '❌ FATAL: Invalid application environment variables:',
      JSON.stringify(formatted, null, 2)
    );
    throw new Error('Environment validation failed');
  }
  return result.data;
}

export const env = parseEnv();
