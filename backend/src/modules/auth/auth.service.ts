import bcrypt from 'bcrypt';
import { AUTH_CONSTANTS } from './auth.constants.js';
import { generateTokenPair } from './auth.tokens.js';
import type { AuthResponse, AuthPayload, RegisterPayload } from './auth.types.js';
import { validateLoginPayload, validateRegisterPayload } from './auth.validation.js';
import AppError from '../../core/errors/AppError.js';
import authRepository from './auth.repository.js';
import User from '../users/user.model.js';

class AuthService {
  public async register(payload: RegisterPayload): Promise<AuthResponse> {
    validateRegisterPayload(payload);

    const existingUser = await authRepository.findUserByEmail(payload.email);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await authRepository.createUser({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone || '',
      passwordHash,
      role: payload.role || AUTH_CONSTANTS.DEFAULT_ROLE,
      status: 'active',
      emailVerified: false,
      permissions: []
    });

    const tokens = generateTokenPair({
      sub: String(user._id),
      email: user.email,
      role: user.role,
      institutionId: (user as any).institutionId ? String((user as any).institutionId) : null
    });

    return { user: user.toObject(), tokens };
  }

  public async login(payload: AuthPayload): Promise<AuthResponse> {
    validateLoginPayload(payload);

    const user = await User.findOne({ email: payload.email.toLowerCase(), isDeleted: { $ne: true } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Account Lockout check
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMins = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
      throw new AppError(`Account locked due to consecutive failed attempts. Try again in ${remainingMins} minutes.`, 423);
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }
      await user.save();
      throw new AppError('Invalid email or password', 401);
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const tokens = generateTokenPair({
      sub: String(user._id),
      email: user.email,
      role: user.role,
      institutionId: (user as any).institutionId ? String((user as any).institutionId) : null
    });

    return { user: user.toObject(), tokens };
  }

  public async refreshToken(token: string): Promise<{ accessToken: string }> {
    if (!token) {
      throw new AppError('Refresh token is required', 400);
    }
    return { accessToken: token };
  }

  public async forgotPassword(email: string): Promise<{ otp: string }> {
    if (!email) throw new AppError('Email address is required', 400);

    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: { $ne: true } });
    if (!user) {
      // Security practice: return success message even if email not found
      return { otp: '000000' };
    }

    // Generate 6-digit OTP token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpSecret = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save();

    console.log(`🔑 OTP generated for ${email}: ${otp}`);

    return { otp };
  }

  public async resetPassword(payload: { email: string; otp: string; newPassword: string }): Promise<void> {
    const { email, otp, newPassword } = payload;
    if (!email || !otp || !newPassword) {
      throw new AppError('Email, OTP code, and new password are required', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: { $ne: true } });
    if (!user || !user.otpSecret || user.otpSecret !== otp) {
      throw new AppError('Invalid or expired OTP verification code', 400);
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new AppError('OTP code has expired. Please request a new one.', 400);
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.otpSecret = undefined;
    user.otpExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }

  public async updateProfile(userId: string, updates: Partial<Record<string, any>>): Promise<any> {
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'bio', 'address', 
      'emergencyContact', 'socialLinks', 'skills', 'certifications', 
      'department', 'avatar', 'coverImage'
    ];

    const filteredUpdates: Record<string, any> = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, { $set: filteredUpdates }, { new: true }).select('-passwordHash');
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}

export default new AuthService();
