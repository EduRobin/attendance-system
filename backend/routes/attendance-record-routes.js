const express = require("express");
const router = express.Router();
const {
    getAttendanceRecordsBySession,
} = require("../controller/attendance-record-controller");

router.get("/session/:sessionId", getAttendanceRecordsBySession);

module.exports = router;