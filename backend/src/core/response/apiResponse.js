export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null
  });
};

export const sendError = (res, message, errors = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors
  });
};

export default { sendSuccess, sendError };
