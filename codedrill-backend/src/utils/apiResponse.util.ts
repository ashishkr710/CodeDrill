import { Response } from 'express';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function sendSuccess<T>({
  res,
  statusCode = 200,
  data,
  message,
  pagination
}: ApiResponseOptions<T>): Response {
  return res.status(statusCode).json({
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(pagination && { pagination }),
    timestamp: new Date().toISOString()
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details: unknown[] = []
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details.length > 0 && { details })
    },
    timestamp: new Date().toISOString()
  });
}
