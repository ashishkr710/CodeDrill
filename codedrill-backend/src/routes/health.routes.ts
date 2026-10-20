import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess, sendError } from '../utils/apiResponse.util.js';

export const healthRouter = Router();

healthRouter.get('/liveness', (_req: Request, res: Response) => {
  return sendSuccess({
    res,
    data: {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    },
    message: 'Server process is alive'
  });
});

healthRouter.get('/readiness', (_req: Request, res: Response) => {
  const isDbReady = mongoose.connection.readyState === 1;

  if (!isDbReady) {
    return sendError(res, 503, 'SERVICE_UNAVAILABLE', 'Database is not connected');
  }

  return sendSuccess({
    res,
    data: {
      status: 'READY',
      database: 'CONNECTED',
      uptime: process.uptime()
    },
    message: 'Service is ready to handle requests'
  });
});
