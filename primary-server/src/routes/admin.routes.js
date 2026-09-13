const express = require("express");
const { getAllUsers, createStandard, updateStandard } = require("../controllers/admin.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(requireAuth, requireRole("ADMIN"));

router.get("/users", getAllUsers);
router.post("/standards", createStandard);
router.put("/standards/:id", updateStandard);

module.exports = router;
