const express = require("express");
const router = express.Router();
const {
    scanCard,
    getAttendanceEvents,
    getAttendanceEventsByClass,
} = require("../controller/attendance-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.post("/scan", authMiddleware, requireRole("admin", "teacher"), scanCard);
router.get("/events", authMiddleware, requireRole("admin", "teacher"), getAttendanceEvents);
router.get("/class/:classId", authMiddleware, requireRole("admin", "teacher"), getAttendanceEventsByClass);

module.exports = router;