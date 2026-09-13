const express = require("express");
const { getSavedItems, saveItem, deleteSavedItem } = require("../controllers/saved.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", getSavedItems);
router.post("/", saveItem);
router.delete("/:id", deleteSavedItem);

module.exports = router;
