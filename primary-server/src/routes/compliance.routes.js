const express = require("express");
const { getComplianceJourneys, getComplianceJourneyById } = require("../controllers/compliance.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/journeys", getComplianceJourneys);
router.get("/journeys/:id", getComplianceJourneyById);

module.exports = router;
