import { Router } from 'express';
import { getAccreditationMetrics } from './ssr.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

router.get('/metrics', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'ACADEMIC_CONTROLLER'), getAccreditationMetrics);

export default router;
