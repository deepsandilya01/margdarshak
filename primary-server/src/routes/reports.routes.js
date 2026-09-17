import { Router } from "express";
import { listResources, getResource } from "../controllers/catalog.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);

router.get("/", listResources('reports'));
router.get("/:id", getResource('reports'));

export default router;
