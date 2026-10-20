import type { Request, Response, NextFunction } from 'express';

/**
 * Cache Control Middleware for sensitive ERP API endpoints.
 * Ensures that private data, student records, examination marks,
 * financial ledgers, and authenticated responses are never stored by
 * shared proxies or public browser caches.
 */
export const noCacheSensitiveEndpoints = (req: Request, res: Response, next: NextFunction): void => {
  // Enforce zero caching on all authenticated and private API responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

export default noCacheSensitiveEndpoints;
