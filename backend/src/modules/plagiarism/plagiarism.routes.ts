import { Router } from 'express';
import { scanPlagiarismAndAI } from './plagiarism.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

router.post('/scan', authenticate, scanPlagiarismAndAI);

export default router;
