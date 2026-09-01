import { Router } from 'express';
import { 
  getWorkflowRules, createWorkflowRule, toggleWorkflowRule,
  getIntegrations, toggleIntegration,
  getApiKeys, createApiKey
} from './automation.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { tenantScope } from '../../middlewares/tenantScope.middleware.js';

const router = Router();

router.use(authenticate, tenantScope);

// Workflows
router.get('/workflows', getWorkflowRules);
router.post('/workflows', createWorkflowRule);
router.patch('/workflows/:id/toggle', toggleWorkflowRule);

// Integrations
router.get('/integrations', getIntegrations);
router.patch('/integrations/:appKey/toggle', toggleIntegration);

// Developer Portal
router.get('/developer/keys', getApiKeys);
router.post('/developer/keys', createApiKey);

export default router;
