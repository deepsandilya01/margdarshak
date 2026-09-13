const express = require("express");
const { getReports, getReportById } = require("../controllers/reports.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", getReports);
router.get("/:id", getReportById);

module.exports = router;
