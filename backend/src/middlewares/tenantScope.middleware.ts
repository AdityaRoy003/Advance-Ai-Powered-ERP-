import type { Request, Response, NextFunction } from 'express';

/**
 * Tenant Scope Middleware
 *
 * Reads `institutionId` from the authenticated user (req.user) and attaches
 * it to `req.institutionId` so all downstream controllers can scope queries.
 *
 * Super Admins (SUPER_ADMIN role) are platform-level and bypass tenant scoping.
 * They can optionally override with `?institutionId=xxx` in query params.
 */
export const tenantScope = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as any;

  if (!user) {
    next();
    return;
  }

  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    // Super Admin can optionally filter by a specific institution
    (req as any).institutionId = req.query.institutionId
      ? String(req.query.institutionId)
      : null; // null means "all institutions"
  } else {
    // All other users are scoped to their own institution
    (req as any).institutionId = user.institutionId || null;
  }

  next();
};

export default tenantScope;
