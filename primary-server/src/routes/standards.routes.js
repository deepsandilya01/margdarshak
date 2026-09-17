import { Router } from "express";
import { listResources, getResource } from "../controllers/catalog.controller.js";


const router = Router();


router.get("/", listResources('standards'));
router.get("/:id", getResource('standards'));

export default router;
