export interface AuthUserPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
      requestId?: string;
    }
  }
}
