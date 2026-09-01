import { sendError } from '../response/apiResponse.js';
import logger from '../../config/logger.js';

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl}`);

  if (err.isOperational) {
    return sendError(res, err.message, err.errors, err.statusCode || 500);
  }

  return sendError(res, 'Internal server error', null, 500);
};

export default errorMiddleware;
