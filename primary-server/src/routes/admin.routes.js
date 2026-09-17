import { Router } from "express";
import { listUsers, createStandard, updateStandard } from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);
router.use(restrictTo('admin'));

router.get("/users", listUsers);
router.post("/standards", createStandard);
router.put("/standards/:id", updateStandard);

export default router;