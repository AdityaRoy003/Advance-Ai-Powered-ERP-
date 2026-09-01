class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors: unknown;

  constructor(message: string, statusCode = 500, errors: unknown = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;
  }
}

export default AppError;
