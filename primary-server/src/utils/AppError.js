export class AppError extends Error {
  constructor(statusCode, message = "Something went wrong", code = "INTERNAL_SERVER_ERROR", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    this.errors = errors;
    this.success = false;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
