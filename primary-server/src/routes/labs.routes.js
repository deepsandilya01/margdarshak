const express = require("express");
const { getLabs, getLabById } = require("../controllers/labs.controller");

const router = express.Router();

router.get("/", getLabs);
router.get("/:id", getLabById);

module.exports = router;
