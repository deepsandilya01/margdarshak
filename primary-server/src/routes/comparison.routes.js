const express = require("express");
const { compareEntities } = require("../controllers/comparison.controller");

const router = express.Router();

router.post("/", compareEntities);

module.exports = router;
