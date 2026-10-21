import rateLimit from 'express-rate-limit';

/**
 * Global API Rate Limiter
 * Guards all endpoints against volumetric DDoS and API abuse.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please slow down and try again later.',
    data: null,
    errors: { code: 'RATE_LIMIT_EXCEEDED' }
  }
});

/**
 * Strict Authentication Rate Limiter
 * Specifically protects login, password reset, and registration endpoints against credential stuffing and brute-force.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Max 30 attempts per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP address. For security, please try again in 15 minutes.',
    data: null,
    errors: { code: 'AUTH_THROTTLED' }
  }
});

export default { apiLimiter, authLimiter };
