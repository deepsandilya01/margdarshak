import { Router } from "express";
import { listResources, getResource } from "../controllers/catalog.controller.js";


const router = Router();


router.get("/", listResources('resources'));
router.get("/:id", getResource('resources'));

export default router;
