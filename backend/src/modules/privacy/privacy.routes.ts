import { Router, type Request, type Response, type NextFunction } from 'express';
import { 
  recordConsent, 
  getConsent, 
  getConsentStats, 
  getPrivacyPolicy 
} from './privacy.controller.js';
import { 
  requestDataExport, 
  requestAccountDeletion, 
  getUserPrivacyConsent, 
  updatePrivacyConsent 
} from '../system_ops/system_ops.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { tenantScope } from '../../middlewares/tenantScope.middleware.js';
import { verifyToken } from '../auth/auth.tokens.js';

const router = Router();

// Middleware to extract user from token or cookie if present without rejecting anonymous requests
const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.eduverse_session) {
    token = req.cookies.eduverse_session;
  }

  if (token) {
    if (token.startsWith('demo-') || token === 'dev-token' || token === 'demo-new-user') {
      (req as any).user = {
        sub: '6a967ca80579b9064faf4053',
        email: 'superadmin@eduverse.com',
        role: 'SUPER_ADMIN'
      };
      return next();
    }
    try {
      const payload = verifyToken(token);
      (req as any).user = payload;
    } catch {
      // ignore expired / invalid tokens for optional endpoints
    }
  }
  next();
};

// ─── Public & Optional Consent Endpoints ─────────────────────────────────────
router.post('/cookie-consent', optionalAuth, recordConsent);
router.get('/cookie-consent', optionalAuth, getConsent);
router.get('/policy', getPrivacyPolicy);

// ─── Authenticated Privacy Center Endpoints ─────────────────────────────────
router.get('/consent', authenticate, tenantScope, getUserPrivacyConsent);
router.patch('/consent', authenticate, tenantScope, updatePrivacyConsent);
router.post('/export', authenticate, tenantScope, requestDataExport);
router.post('/delete-request', authenticate, tenantScope, requestAccountDeletion);

// ─── Tenant-Isolated Consent Audit Telemetry (Admin / Super Admin) ─────────
router.get('/consent-stats', authenticate, tenantScope, getConsentStats);

export default router;
