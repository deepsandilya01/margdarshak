const express = require("express");
const { getQCOs, getQCOById } = require("../controllers/qco.controller");

const router = express.Router();

router.get("/", getQCOs);
router.get("/:id", getQCOById);

module.exports = router;
