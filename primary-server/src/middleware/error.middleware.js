const mongoose = require("mongoose");
const { ApiError } = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, create a new ApiError
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message = error.message || "Something went wrong";
    let code = error.code || "INTERNAL_SERVER_ERROR";
    
    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
      code = "VALIDATION_ERROR";
      error.message = "Duplicate key error";
    }

    error = new ApiError(statusCode, message, code, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    data: null,
    error: {
      code: error.code,
      message: error.message,
    }
  };

  if (process.env.NODE_ENV === "development") {
    response.error.stack = error.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = { errorHandler };
