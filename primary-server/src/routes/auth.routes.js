import express from "express";

import {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
  changePassword,
  googleAuth,
} from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/refresh", refresh);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", requireAuth, changePassword);
router.get("/admin-check", requireAuth, requireRole("ADMIN"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    data: { user: req.user },
  });
});

export default router;
