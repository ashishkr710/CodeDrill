import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util.js';
import { nanoid } from 'nanoid';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-request-id'] as string) || nanoid(10);
  req.headers['x-request-id'] = correlationId;
  res.setHeader('X-Request-Id', correlationId);

  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const logPayload = {
      correlationId,
      method,
      url: originalUrl,
      statusCode,
      durationMs
    };

    if (statusCode >= 500) {
      logger.error(logPayload, `${method} ${originalUrl} ${statusCode} - ${durationMs}ms`);
    } else if (statusCode >= 400) {
      logger.warn(logPayload, `${method} ${originalUrl} ${statusCode} - ${durationMs}ms`);
    } else {
      logger.info(logPayload, `${method} ${originalUrl} ${statusCode} - ${durationMs}ms`);
    }
  });

  next();
}
