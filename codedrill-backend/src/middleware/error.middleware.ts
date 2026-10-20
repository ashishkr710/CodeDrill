import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../constants/errors.constant.js';
import { sendError } from '../utils/apiResponse.util.js';
import { logger } from '../utils/logger.util.js';
import { env } from '../config/env.config.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // 1. Domain AppError
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  // 2. Zod validation failure
  if (err instanceof ZodError) {
    const formattedIssues = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      issue: issue.message
    }));
    sendError(res, 422, 'VALIDATION_FAILED', 'Request validation failed.', formattedIssues);
    return;
  }

  // 3. JSON parse syntax error in request body
  if ('type' in err && (err as { type?: string }).type === 'entity.parse.failed') {
    sendError(res, 400, 'MALFORMED_JSON', 'Malformed JSON payload in request body.');
    return;
  }

  // 4. Uncaught Internal Error
  logger.error({ err }, 'Unhandled internal server error');

  const errorMessage =
    env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message;

  sendError(res, 500, 'INTERNAL_SERVER_ERROR', errorMessage);
}
