import { AppError } from "../utils/AppError.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const errorDetails = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        const primaryMessage = errorDetails[0]?.message || "Validation failed";
        return next(new AppError(400, primaryMessage, "VALIDATION_ERROR", errorDetails));
      }
      return next(new AppError(400, "Invalid input data", "VALIDATION_ERROR"));
    }
  };
};

export default validate;
