import { Router } from "express";
import { compareStandards } from "../controllers/catalog.controller.js";
const router = Router();
router.post("/", compareStandards);
export default router;