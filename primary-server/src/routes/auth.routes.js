import { Router } from "express";
import passport from "passport";
import authController, { register, login, getMe, refresh, logout, googleCallback, verifyGoogleCode } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { registerSchema, loginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, validate(refreshSchema), refresh);

router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);

router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.post("/change-password", requireAuth, validate(changePasswordSchema), authController.changePassword);

// Google OAuth 2.0 routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/v1/auth/google/failure" }),
  googleCallback
);

router.post("/google/verify", authLimiter, verifyGoogleCode);

router.get("/google/failure", (req, res) => {
  res.status(401).json({ success: false, message: "Google authentication failed", code: "OAUTH_FAILED" });
});

export default router;
