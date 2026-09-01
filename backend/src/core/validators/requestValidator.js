import AppError from '../errors/AppError.js';

export const validateRequiredFields = (data, fields) => {
  const missing = fields.filter((field) => !data[field]);

  if (missing.length) {
    throw new AppError('Missing required fields', 400, missing.map((field) => ({ field, message: `${field} is required` })));
  }
};

export default { validateRequiredFields };
