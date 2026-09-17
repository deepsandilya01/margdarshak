import { Router } from "express";
import { listResources, getResource } from "../controllers/catalog.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);

router.get("/", listResources('compliance-journeys'));
router.get("/:id", getResource('compliance-journeys'));

export default router;
