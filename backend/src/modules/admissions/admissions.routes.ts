import { Router } from 'express';
import {
  listApplications,
  updateApplicationStage,
  createApplication,
  trackCandidateApplication
} from './admissions.controller.js';

const router = Router();

// Public candidate tracking
router.get('/track/:appNumber', trackCandidateApplication);

// Application submission (supports both / and /apply)
router.post('/', createApplication);
router.post('/apply', createApplication);

// CRM Administration
router.get('/', listApplications);
router.patch('/:id/stage', updateApplicationStage);

export default router;
