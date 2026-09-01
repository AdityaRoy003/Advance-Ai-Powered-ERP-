import type { Response } from 'express';

export const sendSuccess = (res: Response, message: string, data: unknown = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null
  });
};

export const sendError = (res: Response, message: string, errors: unknown = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors
  });
};

export default { sendSuccess, sendError };
