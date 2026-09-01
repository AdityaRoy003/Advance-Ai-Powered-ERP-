export const buildApiResponse = (success, message, data = null, errors = null) => ({
  success,
  message,
  data,
  errors
});

export default buildApiResponse;
