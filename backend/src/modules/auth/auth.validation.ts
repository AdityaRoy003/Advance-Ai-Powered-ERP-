import AppError from '../../core/errors/AppError.js';
import type { AuthPayload, RegisterPayload } from './auth.types.js';

export const validateLoginPayload = (payload: AuthPayload): void => {
  if (!payload.email || !payload.password) {
    throw new AppError('Email and password are required', 400);
  }
};

export const validateRegisterPayload = (payload: RegisterPayload): void => {
  if (!payload.firstName || !payload.lastName || !payload.email || !payload.password) {
    throw new AppError('First name, last name, email, and password are required', 400);
  }
};

export default { validateLoginPayload, validateRegisterPayload };
