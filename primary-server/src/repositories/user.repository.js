import User from "../models/user.model.js";

export async function findUserByEmail(email) {
  return User.findOne({
    email: String(email || "")
      .trim()
      .toLowerCase(),
  });
}

export async function findUserById(userId) {
  return User.findById(userId);
}

export async function findUserByIdForAuth(userId) {
  return User.findById(userId).select(
    "-password -passwordResetTokenHash -refreshTokenHash",
  );
}

export async function createUser(data) {
  return User.create(data);
}

export async function findUserByProvider(provider, providerId) {
  return User.findOne({ provider, providerId });
}

export async function updateUserById(userId, update) {
  return User.findByIdAndUpdate(userId, update, { new: true });
}

export async function findUserByResetTokenHash(hash) {
  return User.findOne({
    passwordResetTokenHash: hash,
    passwordResetExpires: { $gt: new Date() },
  });
}

export async function findUserByRefreshTokenHash(hash) {
  return User.findOne({ refreshTokenHash: hash });
}
