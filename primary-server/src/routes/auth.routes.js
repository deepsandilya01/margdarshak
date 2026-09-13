const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);
router.post("/change-password", requireAuth, changePassword);

module.exports = router;
