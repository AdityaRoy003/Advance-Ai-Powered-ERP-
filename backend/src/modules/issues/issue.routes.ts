import { Router } from 'express';
import { 
  createIssue, 
  getIssues, 
  getIssueByTicketId, 
  updateIssueStatus, 
  getIssueStats 
} from './issue.controller.js';

const router = Router();

// Public / Authenticated Issue Reporting
router.post('/', createIssue);

// Public Ticket Tracker
router.get('/track/:ticketId', getIssueByTicketId);

// Issues list & stats
router.get('/', getIssues);
router.get('/stats', getIssueStats);

// Update status and provide user resolution update
router.patch('/:id', updateIssueStatus);

export default router;
