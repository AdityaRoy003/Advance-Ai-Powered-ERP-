import { Router } from 'express';
import {
  listInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  suspendInstitution,
  reactivateInstitution,
  deleteInstitution,
  getInstitutionUsers,
  listPublicInstitutions,
  onboardWorkspace,
  getInstitutionBilling,
  upgradeSubscription
} from './institution.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// ─── Public SaaS Endpoints ─────────────────────────────────────────────────
// Onboard a trial workspace (no login required)
router.post('/onboard-workspace', onboardWorkspace);
// Public list for campus switchers
router.get('/public-list', listPublicInstitutions);

// ─── Institutional Billing & Quotas (Tenant Admin & Super Admin) ────────────
router.get('/:id/billing', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getInstitutionBilling);
router.post('/:id/billing/upgrade', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), upgradeSubscription);

// ─── Super Admin Enterprise Management ──────────────────────────────────────
router.get('/', authenticate, authorizeRoles('SUPER_ADMIN'), listInstitutions);
router.post('/', authenticate, authorizeRoles('SUPER_ADMIN'), createInstitution);
router.get('/:id', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getInstitution);
router.put('/:id', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateInstitution);
router.patch('/:id/suspend', authenticate, authorizeRoles('SUPER_ADMIN'), suspendInstitution);
router.patch('/:id/reactivate', authenticate, authorizeRoles('SUPER_ADMIN'), reactivateInstitution);
router.delete('/:id', authenticate, authorizeRoles('SUPER_ADMIN'), deleteInstitution);
router.get('/:id/users', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getInstitutionUsers);

export default router;
