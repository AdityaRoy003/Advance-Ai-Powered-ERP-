import { Router } from 'express';
import {
  listApplications,
  updateApplicationStage,
  createApplication,
  trackCandidateApplication
} from './admissions.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Public candidate tracking
router.get('/track/:appNumber', trackCandidateApplication);
// Public or authenticated application submission
router.post('/apply', createApplication);

// CRM Administration
router.get('/', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'ACADEMIC_CONTROLLER', 'RECEPTIONIST'), listApplications);
router.patch('/:id/stage', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN', 'ACADEMIC_CONTROLLER'), updateApplicationStage);

export default router;
