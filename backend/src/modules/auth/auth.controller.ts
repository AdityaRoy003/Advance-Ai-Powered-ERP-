import crypto from 'crypto';
import type { Request, Response } from 'express';
import authService from './auth.service.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';
import AppError from '../../core/errors/AppError.js';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, 'User registered successfully', result, 201);
  } catch (error) {
    const err = error instanceof AppError ? error : new AppError('Registration failed', 500);
    return sendError(res, err.message, err.errors, err.statusCode);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    const isProd = process.env.NODE_ENV === 'production';
    if (result?.tokens?.accessToken) {
      res.cookie('eduverse_session', result.tokens.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      const csrfToken = crypto.randomUUID();
      res.cookie('XSRF-TOKEN', csrfToken, {
        secure: isProd,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });
    }

    return sendSuccess(res, 'Login successful', result, 200);
  } catch (error) {
    const err = error instanceof AppError ? error : new AppError('Login failed', 500);
    return sendError(res, err.message, err.errors, err.statusCode);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('eduverse_session', { httpOnly: true, sameSite: 'lax' });
  res.clearCookie('XSRF-TOKEN', { sameSite: 'lax' });
  return sendSuccess(res, 'Logout successful', null, 200);
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    const result = await authService.refreshToken(String(refreshToken || ''));
    return sendSuccess(res, 'Token refreshed successfully', result, 200);
  } catch (error) {
    const err = error instanceof AppError ? error : new AppError('Refresh failed', 500);
    return sendError(res, err.message, err.errors, err.statusCode);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await authService.forgotPassword(req.body.email);
    return sendSuccess(res, 'If an account exists with this email address, a password reset verification code has been dispatched.', null, 200);
  } catch (error) {
    const err = error instanceof AppError ? error : new AppError('Forgot password request failed', 500);
    return sendError(res, err.message, err.errors, err.statusCode);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body);
    return sendSuccess(res, 'Password reset successful. You can now login with your new password.', null, 200);
  } catch (error) {
    const err = error instanceof AppError ? error : new AppError('Reset password failed', 500);
    return sendError(res, err.message, err.errors, err.statusCode);
  }
};

export const verifyEmail = (req: Request, res: Response) => {
  return sendSuccess(res, 'Email verified successfully', null, 200);
};

export const resendVerification = (req: Request, res: Response) => {
  return sendSuccess(res, 'Verification email resent', null, 200);
};

export const profile = (req: Request, res: Response) => {
  return sendSuccess(res, 'Profile retrieved successfully', { user: req.user || null }, 200);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id || (req.user as any)?.id || req.body.userId;
    if (!userId) throw new AppError('Unauthorized', 401);
    const updatedUser = await authService.updateProfile(userId, req.body);
    return sendSuccess(res, 'Profile updated successfully', updatedUser, 200);
  } catch (error) {
    const err = error instanceof AppError ? error : new AppError('Profile update failed', 500);
    return sendError(res, err.message, err.errors, err.statusCode);
  }
};

export default {
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
};
