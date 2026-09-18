import { Router } from "express";
import { listUsers, createStandard, updateStandard, ingestBisDocuments } from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);
router.use(restrictTo('admin'));

router.get("/users", listUsers);
router.post("/standards", createStandard);
router.put("/standards/:id", updateStandard);
router.post("/knowledge/ingest", ingestBisDocuments);

export default router;