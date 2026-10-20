export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details: unknown[] = []
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details: unknown[] = []) {
    super(400, 'BAD_REQUEST', message, details);
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
  constructor(entity: string, identifier?: string) {
    const msg = identifier
      ? `${entity} with identifier '${identifier}' not found.`
      : `${entity} not found.`;
    super(404, 'NOT_FOUND', msg);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown[]) {
    super(422, 'VALIDATION_FAILED', 'Request validation failed.', details);
  }
}

export class RateLimitExceededError extends AppError {
  constructor(message = 'Too many requests, please try again later.') {
    super(429, 'RATE_LIMIT_EXCEEDED', message);
  }
}
