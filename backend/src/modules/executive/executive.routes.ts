import { Router } from 'express';
import { 
  getExecutiveBriefing, getWhatChangedDeltas, 
  runWhatIfSimulation, getInnovationRecommendations 
} from './executive.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { tenantScope } from '../../middlewares/tenantScope.middleware.js';

const router = Router();

router.use(authenticate, tenantScope);

router.get('/briefing', getExecutiveBriefing);
router.get('/what-changed', getWhatChangedDeltas);
router.post('/simulate', runWhatIfSimulation);
router.get('/recommendations', getInnovationRecommendations);

export default router;
