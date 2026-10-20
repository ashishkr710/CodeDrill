import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { ForbiddenError, UnauthorizedError } from '../constants/errors.constant.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization token required', 'TOKEN_MISSING');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Malformed authorization header', 'TOKEN_MALFORMED');
  }

  try {
    const payload = authService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    throw new ForbiddenError('Administrative privileges required', 'INSUFFICIENT_PERMISSIONS');
  }
  next();
}
