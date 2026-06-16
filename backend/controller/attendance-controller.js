const AttendanceEvent = require("../models/AttendanceEvent");
const processScan = require("../abl/attendance/process-scan-abl");

const scanCard = async (req, res) => {
    try {
        const { uid, readerId } = req.body;

        const result = await processScan(uid, readerId || "tapper-1");

        return res.status(200).json(result);
    } catch (error) {
        console.error("scanCard error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAttendanceEvents = async (req, res) => {
    try {
        const events = await AttendanceEvent.find()
            .populate("studentId", "name cardUid")
            .sort({ timestamp: -1 });

        return res.status(200).json(events);
    } catch (error) {
        console.error("getAttendanceEvents error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAttendanceEventsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const events = await AttendanceEvent.find({ classId })
            .populate("studentId", "name cardUid")
            .sort({ timestamp: -1 });

        return res.status(200).json(events);
    } catch (error) {
        console.error("getAttendanceEventsByClass error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    scanCard,
    getAttendanceEvents,
    getAttendanceEventsByClass,
};