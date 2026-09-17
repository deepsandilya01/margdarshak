import { Router } from "express";
import { getSavedItems, saveItem, deleteSavedItem } from "../controllers/saved.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { saveItemSchema } from "../validators/saved.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", getSavedItems);
router.post("/", validate(saveItemSchema), saveItem);
router.delete("/:id", deleteSavedItem);

export default router;
