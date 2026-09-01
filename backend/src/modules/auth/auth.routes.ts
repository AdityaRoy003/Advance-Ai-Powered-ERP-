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

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/profile', authenticate, profile);
router.put('/profile', authenticate, updateProfile);

export default router;
