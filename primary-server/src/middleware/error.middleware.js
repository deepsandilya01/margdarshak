import { errorResponse } from "../utils/apiResponse.js";

export function notFoundHandler(req, res) {
  return errorResponse(res, 404, "Resource not found", "NOT_FOUND");
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const code =
    err.code ||
    (statusCode === 401
      ? "UNAUTHORIZED"
      : statusCode === 403
        ? "FORBIDDEN"
        : "INTERNAL_SERVER_ERROR");

  const message =
    statusCode >= 500
      ? "Something went wrong on the server"
      : err.message || "Request failed";

  return errorResponse(res, statusCode, message, code);
}
