const express = require("express");
const router = express.Router();
const {
    seedDemoData,
    addTestStudentsToSession,
} = require("../controller/setup-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.post("/seed", authMiddleware, requireRole("admin"), seedDemoData);
router.post(
    "/add-test-students-to-session",
    authMiddleware,
    requireRole("admin"),
    addTestStudentsToSession
);

module.exports = router;