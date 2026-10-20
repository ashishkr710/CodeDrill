import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { authRouter } from './auth.routes.js';
import { sendSuccess } from '../utils/apiResponse.util.js';

export const apiRouter = Router();

// Root API ping
apiRouter.get('/', (_req, res) => {
  return sendSuccess({
    res,
    data: {
      name: 'CodeDrill REST API',
      version: '1.0.0',
      docsUrl: '/api-docs'
    },
    message: 'Welcome to CodeDrill API v1'
  });
});

// Mount health routes under /api/v1/health
apiRouter.use('/health', healthRouter);

// Mount auth routes under /api/v1/auth
apiRouter.use('/auth', authRouter);
