const express = require("express");
const router = express.Router();
const {
    getClasses,
    getClassById,
    getClassDashboard,
} = require("../controller/class-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.get("/", authMiddleware, requireRole("admin", "teacher"), getClasses);
router.get("/:id/dashboard", authMiddleware, requireRole("admin", "teacher"), getClassDashboard);
router.get("/:id", authMiddleware, requireRole("admin", "teacher"), getClassById);

module.exports = router;