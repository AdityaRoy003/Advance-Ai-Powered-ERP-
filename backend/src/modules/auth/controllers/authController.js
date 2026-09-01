import { sendSuccess } from '../../../core/response/apiResponse.js';

export const healthCheck = (req, res) => {
  return sendSuccess(res, 'Auth module is ready', { module: 'auth', version: 'v1' });
};

export default { healthCheck };
