const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userRepository = require("../repositories/user.repository");
const { ApiError } = require("../utils/ApiError");

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await userRepository.findUserById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async ({ name, email, password }) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists", "USER_ALREADY_EXISTS");
  }

  const user = await userRepository.createUser({ name, email: email.toLowerCase(), password });
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  return { user, accessToken, refreshToken };
};

const loginUser = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  user.lastLoginAt = new Date();
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  return { user, accessToken, refreshToken };
};

const logoutUser = async (userId) => {
  await userRepository.unsetRefreshToken(userId);
};

const refreshAccessToken = async (incomingRefreshToken) => {
  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET || "default_refresh_secret");
    
    const user = await userRepository.findUserById(decoded.sub);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is invalid or expired", "INVALID_TOKEN");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, "Refresh token is invalid or expired", "TOKEN_EXPIRED");
  }
};

const initiatePasswordReset = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) return null;

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userRepository.findUserByResetToken(hashedToken);

  if (!user) {
    throw new ApiError(400, "Token is invalid or has expired", "INVALID_TOKEN");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findUserById(userId);
  const isCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isCorrect) {
    throw new ApiError(400, "Incorrect current password", "VALIDATION_ERROR");
  }

  user.password = newPassword;
  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  initiatePasswordReset,
  resetPassword,
  changePassword,
};
