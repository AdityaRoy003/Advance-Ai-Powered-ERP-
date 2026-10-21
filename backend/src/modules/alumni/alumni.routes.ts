import { Router } from 'express';
import {
  getAlumniDirectory,
  getAlumniJobs,
  getEndowments,
  pledgeDonation
} from './alumni.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

router.get('/directory', authenticate, getAlumniDirectory);
router.get('/jobs', authenticate, getAlumniJobs);
router.get('/endowments', authenticate, getEndowments);
router.post('/endowments/pledge', authenticate, pledgeDonation);

export default router;
