import { validateRequiredFields } from '../../core/validators/requestValidator.js';

export const validateAuthPayload = (payload) => {
  validateRequiredFields(payload, ['email', 'password']);
};

export default { validateAuthPayload };
