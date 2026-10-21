import { Router } from 'express';
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  profile,
  updateProfile
} from './auth.controller.js';
import { authenticate } from './auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh', authLimiter, refresh);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
router.get('/profile', authenticate, profile);
router.put('/profile', authenticate, updateProfile);

export default router;
