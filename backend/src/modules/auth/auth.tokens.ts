import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import { AUTH_CONSTANTS } from './auth.constants.js';
import type { TokenPair } from './auth.types.js';

export const generateTokenPair = (payload: Record<string, unknown>): TokenPair => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_TTL });
  const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, env.JWT_SECRET, { expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_TTL });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET);

export default { generateTokenPair, verifyToken };
