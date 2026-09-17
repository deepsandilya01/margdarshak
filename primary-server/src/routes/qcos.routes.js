import { Router } from "express";
import { listResources, getResource } from "../controllers/catalog.controller.js";


const router = Router();


router.get("/", listResources('qcos'));
router.get("/:id", getResource('qcos'));

export default router;
