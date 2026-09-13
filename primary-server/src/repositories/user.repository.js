const User = require("../models/user.model");

const findUserById = async (id) => {
  return await User.findById(id);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

const createUser = async (data) => {
  return await User.create(data);
};

const findUserByResetToken = async (hashedToken) => {
  return await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
};

const unsetRefreshToken = async (userId) => {
  return await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};

const findUsersForAdmin = async () => {
  return await User.find().select("-password -refreshToken -passwordResetToken").lean();
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  findUserByResetToken,
  unsetRefreshToken,
  findUsersForAdmin,
};
