import { Router } from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  getSessionMessages,
  deleteSession,
} from "../controllers/session.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", createSession);
router.get("/", getSessions);
router.get("/:id", getSessionById);
router.patch("/:id", updateSession);
router.get("/:id/messages", getSessionMessages);
router.delete("/:id", deleteSession);

export default router;
