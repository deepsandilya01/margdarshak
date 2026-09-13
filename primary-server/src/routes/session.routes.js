const express = require("express");
const {
  createSession,
  getSessions,
  getSessionById,
  getSessionMessages,
} = require("../controllers/session.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", createSession);
router.get("/", getSessions);
router.get("/:id", getSessionById);
router.get("/:id/messages", getSessionMessages);

module.exports = router;
