import { Router } from 'express';
import { 
  getClubs, getPosts, createPost, getGamificationProfile 
} from './social.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { tenantScope } from '../../middlewares/tenantScope.middleware.js';

const router = Router();

router.use(authenticate, tenantScope);

// Community & Clubs
router.get('/clubs', getClubs);
router.get('/posts', getPosts);
router.post('/posts', createPost);

// Gamification
router.get('/gamification/profile', getGamificationProfile);

export default router;
