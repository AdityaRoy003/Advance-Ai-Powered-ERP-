class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;
  }
}

export default AppError;
