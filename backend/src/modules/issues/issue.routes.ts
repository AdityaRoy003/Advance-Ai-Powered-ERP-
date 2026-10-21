import { Router } from 'express';
import { 
  createIssue, 
  getIssues, 
  getIssueByTicketId, 
  updateIssueStatus, 
  getIssueStats 
} from './issue.controller.js';

import { authenticate } from '../auth/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// Public / Authenticated Issue Reporting
router.post('/', createIssue);

// Public Ticket Tracker
router.get('/track/:ticketId', getIssueByTicketId);

// Issues queue & stats for administration
router.get('/', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getIssues);
router.get('/stats', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), getIssueStats);

// Update status and provide user resolution update (Admins only)
router.patch('/:id', authenticate, authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateIssueStatus);

export default router;
