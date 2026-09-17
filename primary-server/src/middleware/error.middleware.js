import env from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";
    error = new AppError(
      409,
      `A record with that ${duplicateField} already exists`,
      "RESOURCE_ALREADY_EXISTS"
    );
  }

  // Transform Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    error = new AppError(400, `Invalid ID format for ${err.path}`, "INVALID_ID");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const code = error.code || "INTERNAL_SERVER_ERROR";

  const response = {
    success: false,
    message,
    code,
    ...(error.errors && error.errors.length > 0 ? { errors: error.errors } : {}),
  };

  if (env.NODE_ENV === "development" && error.stack && statusCode === 500) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

export default errorHandler;
