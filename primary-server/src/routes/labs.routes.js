import { Router } from "express";
import { listResources, getResource } from "../controllers/catalog.controller.js";


const router = Router();


router.get("/", listResources('labs'));
router.get("/:id", getResource('labs'));

export default router;
