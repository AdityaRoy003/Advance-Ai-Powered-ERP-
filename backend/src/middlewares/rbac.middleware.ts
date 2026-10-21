import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../core/response/apiResponse.js';

/**
 * Role-Based Access Control (RBAC) Middleware.
 * Enforces that the authenticated user possesses one of the allowed system roles.
 *
 * @param allowedRoles List of roles permitted to access the resource
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as any;

    if (!user) {
      sendError(res, 'Authentication required to access this resource', null, 401);
      return;
    }

    const userRole = (user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    // Super Admin has global administrative override
    if (userRole === 'SUPER_ADMIN' || normalizedAllowed.includes(userRole)) {
      next();
      return;
    }

    sendError(
      res,
      `Forbidden: Your role (${userRole}) is not authorized to access this resource`,
      { requiredRoles: allowedRoles },
      403
    );
  };
};

export default authorizeRoles;
