# CodeDrill — Backend Architecture & Engineering Specification

**Version:** 1.0.0  
**Stack:** Node.js (Active LTS) / Express / TypeScript (Strict) / MongoDB (Mongoose)  
**Author:** Full-Stack TypeScript Architect  

---

## 1. Directory Structure

The backend application `codedrill-backend` is organized cleanly into domain-driven, strictly decoupled layers:

```
codedrill-backend/
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── @types/                     # Express request ambient type extensions
│   │   └── express.d.ts            # Augmented Request with user context
│   ├── config/                     # Environment configuration & invariants
│   │   ├── env.config.ts           # Zod-validated process.env schema
│   │   └── db.config.ts            # MongoDB connection lifecycle manager
│   ├── constants/                  # Business & system constants
│   │   ├── errors.constant.ts      # Standardized error codes & messages
│   │   └── limits.constant.ts      # Rate limits, timeouts, SM-2 defaults
│   ├── middleware/                 # Express middleware pipeline
│   │   ├── auth.middleware.ts      # JWT extraction & permission checks
│   │   ├── error.middleware.ts     # Global centralized error handler
│   │   ├── rateLimiter.middleware.ts # IP & user rate limiting
│   │   ├── requestLogger.middleware.ts # Pino correlation & HTTP logger
│   │   └── validate.middleware.ts  # Generic Zod validation middleware
│   ├── models/                     # Mongoose models & schemas
│   │   ├── user.model.ts
│   │   ├── refreshToken.model.ts
│   │   ├── track.model.ts
│   │   ├── topic.model.ts
│   │   ├── question.model.ts
│   │   ├── submission.model.ts
│   │   ├── userProgress.model.ts
│   │   ├── revisionItem.model.ts
│   │   └── bookmark.model.ts
│   ├── adapters/                   # External service integration abstractions
│   │   └── execution/              # Sandboxed code execution adapters
│   │       ├── execution.adapter.interface.ts
│   │       ├── judge0.adapter.ts
│   │       ├── piston.adapter.ts
│   │       └── mock.adapter.ts
│   ├── routes/                     # Route definitions & HTTP verb bindings
│   │   ├── index.ts                # Master API router mounting /api/v1
│   │   ├── auth.routes.ts
│   │   ├── curriculum.routes.ts
│   │   ├── question.routes.ts
│   │   ├── practice.routes.ts
│   │   ├── progress.routes.ts
│   │   ├── revision.routes.ts
│   │   ├── bookmark.routes.ts
│   │   └── admin.routes.ts
│   ├── controllers/                # HTTP layer (request/response orchestration)
│   │   ├── auth.controller.ts
│   │   ├── curriculum.controller.ts
│   │   ├── question.controller.ts
│   │   ├── practice.controller.ts
│   │   ├── progress.controller.ts
│   │   ├── revision.controller.ts
│   │   ├── bookmark.controller.ts
│   │   └── admin.controller.ts
│   ├── services/                   # Pure business logic & domain calculations
│   │   ├── auth.service.ts
│   │   ├── curriculum.service.ts
│   │   ├── question.service.ts
│   │   ├── practice.service.ts
│   │   ├── execution.service.ts
│   │   ├── progress.service.ts
│   │   ├── revision.service.ts
│   │   ├── bookmark.service.ts
│   │   └── admin.service.ts
│   ├── schemas/                    # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── question.schema.ts
│   │   ├── practice.schema.ts
│   │   └── revision.schema.ts
│   ├── utils/                      # Helper utilities
│   │   ├── logger.util.ts          # Pino singleton instance
│   │   ├── crypto.util.ts          # Argon2 & token helpers
│   │   └── apiResponse.util.ts     # Standardized JSON response helpers
│   ├── app.ts                      # Express app configuration & middleware mount
│   └── server.ts                   # Process bootstrap, port bind, shutdown traps
└── tests/                          # Integration and unit tests
    ├── integration/
    │   ├── auth.test.ts
    │   ├── practice.test.ts
    │   └── execution.test.ts
    └── unit/
        ├── sm2.test.ts
        └── grading.test.ts
```

---

## 2. Layer Responsibilities & Data Boundary Rules

To prevent code entanglement, dependencies only flow downward:
`Routes -> Validation -> Controllers -> Services -> Models / Adapters`

1. **Routes (`routes/*.routes.ts`):** Only map paths, verbs, and chain middleware. No business logic.
2. **Validation Middleware (`middleware/validate.middleware.ts`):** Validates raw inputs with Zod and passes strongly typed values into controllers.
3. **Controllers (`controllers/*.controller.ts`):** Extract typed inputs (`req.body`, `req.query`, `req.params`), call the appropriate service method, and format the HTTP response. Never execute database queries directly.
4. **Services (`services/*.service.ts`):** Encapsulate all business logic, transaction handling, grading algorithms, SM-2 retention rules, and calls to external adapters. Services return plain JavaScript objects or throw typed domain errors.
5. **Models (`models/*.model.ts`):** Define Mongoose schemas, compound indexes, virtuals, and persistence hooks.
6. **Adapters (`adapters/*`):** Interface-driven wrappers for external systems (e.g., Judge0 sandbox) allowing easy mocking during unit tests.

---

## 3. Configuration & Environment Invariants

Configuration is strictly validated at application startup using Zod in `src/config/env.config.ts`. If any mandatory variable is missing or malformed, the application terminates immediately with a descriptive fatal error.

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  
  // Database
  MONGODB_URI: z.string().url(),
  
  // Authentication Secrets
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  
  // Code Execution Sandbox
  EXECUTION_SANDBOX_TYPE: z.enum(['judge0', 'piston', 'mock']).default('judge0'),
  JUDGE0_API_URL: z.string().url().default('http://localhost:2358'),
  JUDGE0_API_KEY: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(120),
  CODE_EXECUTION_MAX_PER_MINUTE: z.coerce.number().default(15)
});

export const env = envSchema.parse(process.env);
```

---

## 4. Centralized Error Handling

All anticipated and unanticipated errors funnel through a single Express error middleware.

### 4.1 Custom Application Error Hierarchy
```typescript
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: any[] = []
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', code = 'UNAUTHORIZED') {
    super(401, code, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', code = 'FORBIDDEN') {
    super(403, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    super(404, 'NOT_FOUND', `${entity} ${id ? `with ID ${id}` : ''} not found.`);
  }
}

export class ValidationError extends AppError {
  constructor(details: any[]) {
    super(422, 'VALIDATION_FAILED', 'Input data validation failed.', details);
  }
}
```

### 4.2 Error Middleware Behavior
- Catches Zod errors and transforms them into standard 422 problem details.
- Logs full error traces with correlation ID using Pino for 500 errors.
- Sanitizes error payloads in production so internal stack traces are never exposed to clients.

---

## 5. Security & Hardening Checklist

| Domain | Control Measure | Implementation Details |
| :--- | :--- | :--- |
| **HTTP Headers** | Helmet | Sets Strict-Transport-Security, X-Content-Type-Options: nosniff, Frameguard, and X-XSS-Protection. |
| **CORS** | Strict Origin | Only accepts requests matching `env.CORS_ORIGIN` with credentials enabled. |
| **Cookie Storage** | Refresh Token | `HttpOnly: true`, `SameSite: 'strict'`, `Secure: true` (in production). |
| **Password Hashing** | Argon2id | Memory cost 64MB, 3 iterations, 4 parallelism lanes. Far exceeds bcrypt GPU attack resistance. |
| **Rate Limiting** | Tiered Limiting | General API: 120 req/min per IP. Sandbox runner: 15 submissions/min per user. |
| **NoSQL Injection** | Mongoose Sanitization | Schema casting + explicit validation strips unescaped Mongo query operators (`$gt`, `$where`). |
| **Process Hygiene** | Graceful Shutdown | Handles `SIGTERM` and `SIGINT`, draining active connections and closing Mongo pools before exiting. |
| **Payload Size** | Request Body Cap | Limits JSON request bodies to `512kb` preventing memory exhaustion denial-of-service. |
