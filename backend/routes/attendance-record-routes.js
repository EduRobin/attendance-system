const express = require("express");
const router = express.Router();
const {
    getAttendanceRecordsBySession,
} = require("../controller/attendance-record-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.get(
    "/session/:sessionId",
    authMiddleware,
    requireRole("admin", "teacher"),
    getAttendanceRecordsBySession
);

module.exports = router;