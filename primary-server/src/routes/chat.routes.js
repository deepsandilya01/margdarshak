import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { chatLimiter } from "../middleware/rateLimit.middleware.js";
import { chatSchema } from "../validators/chat.validator.js";

const router = Router();

router.post("/", requireAuth, chatLimiter, validate(chatSchema), sendMessage);

export default router;
