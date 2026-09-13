import validator from "validator";

export function isStrongPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function validateRegister({ name, email, password }) {
  const errors = {};

  if (!name || !String(name).trim()) {
    errors.name = "Name is required";
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || !isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters and contain letters and numbers";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { name: String(name || "").trim(), email: normalizedEmail, password },
  };
}

export function validateLogin({ email, password }) {
  const errors = {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || !String(password).trim()) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { email: normalizedEmail, password },
  };
}

export function validateForgotPassword({ email }) {
  const errors = {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !validator.isEmail(normalizedEmail)) {
    errors.email = "Please provide a valid email address";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { email: normalizedEmail },
  };
}

export function validateResetPassword({ token, password }) {
  const errors = {};

  if (!token || !String(token).trim()) {
    errors.token = "Reset token is required";
  }

  if (!password || !isStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters and contain letters and numbers";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { token: String(token || "").trim(), password },
  };
}

export function validateChangePassword({ currentPassword, newPassword }) {
  const errors = {};

  if (!currentPassword || !String(currentPassword).trim()) {
    errors.currentPassword = "Current password is required";
  }

  if (!newPassword || !isStrongPassword(newPassword)) {
    errors.newPassword =
      "New password must be at least 8 characters and contain letters and numbers";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { currentPassword, newPassword },
  };
}
