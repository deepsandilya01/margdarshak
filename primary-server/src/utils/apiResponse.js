export function successResponse(
  res,
  statusCode = 200,
  message = "Success",
  data = {},
  meta = null,
) {
  const payload = {
    success: true,
    data: data ?? null,
    meta: meta ?? null,
    error: null,
  };

  if (message && message !== "Success") {
    payload.message = message;
  }

  return res.status(statusCode).json(payload);
}

export function errorResponse(
  res,
  statusCode = 400,
  message = "Request failed",
  code = "BAD_REQUEST",
  details = null,
) {
  const payload = {
    success: false,
    data: null,
    error: { code, message, ...(details ? { details } : {}) },
    code,
    message,
  };

  return res.status(statusCode).json(payload);
}
