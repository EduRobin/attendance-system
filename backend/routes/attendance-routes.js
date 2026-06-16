const express = require("express");
const router = express.Router();
const {
    scanCard,
    getAttendanceEvents,
    getAttendanceEventsByClass,
} = require("../controller/attendance-controller");

router.post("/scan", scanCard);
router.get("/events", getAttendanceEvents);
router.get("/class/:classId", getAttendanceEventsByClass);

module.exports = router;