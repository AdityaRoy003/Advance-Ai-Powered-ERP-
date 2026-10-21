import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from './auth.tokens.js';
import { sendError } from '../../core/response/apiResponse.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.eduverse_session) {
    token = req.cookies.eduverse_session;

    // If authenticating via cookie on state-changing methods, enforce CSRF protection
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const xsrfHeader = req.headers['x-xsrf-token'] || req.headers['x-csrf-token'];
      const xsrfCookie = req.cookies['XSRF-TOKEN'];
      if (!xsrfHeader || !xsrfCookie || xsrfHeader !== xsrfCookie) {
        return sendError(res, 'Cross-Site Request Forgery (CSRF) token verification failed', null, 403);
      }
    }
  }

  if (!token) {
    return sendError(res, 'Authentication token is required', null, 401);
  }

  // Allow mock dev tokens only in development if explicitly enabled
  const isDevMode = process.env.NODE_ENV !== 'production';
  const allowDemoTokens = isDevMode && process.env.ALLOW_DEMO_TOKENS === 'true';

  if (allowDemoTokens && (token.startsWith('demo-') || token === 'dev-token')) {
    req.user = {
      sub: '6a967ca80579b9064faf4053',
      id: '6a967ca80579b9064faf4053',
      email: 'demo@eduverse.com',
      role: 'EMPLOYEE'
    };
    return next();
  }

  try {
    const payload = verifyToken(token) as {
      sub: string;
      email: string;
      role: string;
      institutionId?: string;
    };

    req.user = {
      ...payload,
      id: payload.sub,
      _id: payload.sub
    };

    return next();
  } catch (err) {
    return sendError(res, 'Invalid, expired, or tampered authentication token', null, 401);
  }
};

export default { authenticate };
