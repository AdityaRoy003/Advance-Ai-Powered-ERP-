import { Router } from 'express';
import { processLecture } from './lecture.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

router.post('/process', authenticate, processLecture);

export default router;
