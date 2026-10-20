import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.config.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';
import { healthRouter } from './routes/health.routes.js';
import { NotFoundError } from './constants/errors.constant.js';

export function createApp(): Express {
  const app = express();

  // 1. Security HTTP Headers
  app.use(helmet());

  // 2. Strict Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
    })
  );

  // 3. Body parsers and cookie parser
  app.use(express.json({ limit: '512kb' }));
  app.use(express.urlencoded({ extended: true, limit: '512kb' }));
  app.use(cookieParser());

  // 4. Request Logging & Correlation ID
  app.use(requestLogger);

  // 5. Global Rate Limiter
  const globalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP. Please try again later.'
      },
      timestamp: new Date().toISOString()
    }
  });
  app.use('/api/', globalLimiter);

  // 6. Direct Health Probes (for Docker/Kubernetes container probes)
  app.use('/health', healthRouter);

  // 7. Mount Master REST API
  app.use('/api/v1', apiRouter);

  // 8. 404 Handler for undefined routes
  app.use((req, _res, next) => {
    next(new NotFoundError('Endpoint', `${req.method} ${req.originalUrl}`));
  });

  // 9. Centralized Error Handler Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
