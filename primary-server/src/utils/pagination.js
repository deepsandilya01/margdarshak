export function parsePagination(query) {
  const page = Number.parseInt(query.page || "1", 10);
  const limit = Number.parseInt(query.limit || "20", 10);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    const error = new Error(
      "page must be >= 1 and limit must be between 1 and 100",
    );
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }
  return { page, limit };
}

export function publicId(item) {
  if (!item) return item;
  const value = { ...item };
  if (value._id) {
    value.id = value.id || value._id.toString();
    delete value._id;
  }
  delete value.__v;
  return value;
}
