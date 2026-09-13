import express from "express";
import {
  compare,
  deleteSaved,
  getLab,
  getQco,
  getReport,
  getResource,
  getStandard,
  listJourneys,
  listLabs,
  listQcos,
  listReports,
  listResources,
  listSaved,
  listStandards,
  saveItem,
} from "../controllers/data.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/standards", listStandards);
router.get("/standards/:id", getStandard);
router.get("/qcos", listQcos);
router.get("/qcos/:id", getQco);
router.get("/labs", listLabs);
router.get("/labs/:id", getLab);
router.get("/reports", requireAuth, listReports);
router.get("/reports/:id", requireAuth, getReport);
router.get("/resources", listResources);
router.get("/resources/:id", getResource);
router.get("/compliance/journeys", listJourneys);
router.post("/comparison", compare);
router.get("/saved", requireAuth, listSaved);
router.post("/saved", requireAuth, saveItem);
router.delete("/saved/:id", requireAuth, deleteSaved);

export default router;
