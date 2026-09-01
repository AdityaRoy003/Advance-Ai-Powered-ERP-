import { Router } from 'express';
import { 
  getModelRegistry, rollbackModelVersion,
  getITMetricsAndIncidents,
  getUserPrivacyConsent, updatePrivacyConsent, requestDataExport
} from './system_ops.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { tenantScope } from '../../middlewares/tenantScope.middleware.js';

const router = Router();

router.use(authenticate, tenantScope);

// MLOps
router.get('/mlops/models', getModelRegistry);
router.patch('/mlops/models/:id/rollback', rollbackModelVersion);

// IT Assistant & Diagnostics
router.get('/it/diagnostics', getITMetricsAndIncidents);

// Privacy Center
router.get('/privacy/consent', getUserPrivacyConsent);
router.patch('/privacy/consent', updatePrivacyConsent);
router.post('/privacy/export', requestDataExport);

export default router;
