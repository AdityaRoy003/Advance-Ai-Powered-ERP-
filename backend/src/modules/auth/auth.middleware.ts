import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from './auth.tokens.js';
import { sendError } from '../../core/response/apiResponse.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token is required', null, 401);
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token) as {
      sub: string;
      email: string;
      role: string;
      institutionId?: string;
    };
    req.user = payload;
    return next();
  } catch {
    return sendError(res, 'Invalid or expired token', null, 401);
  }
};

export default { authenticate };
