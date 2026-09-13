const express = require("express");
const { getStandards, getStandardById } = require("../controllers/standards.controller");

const router = express.Router();

router.get("/", getStandards);
router.get("/:id", getStandardById);

module.exports = router;
