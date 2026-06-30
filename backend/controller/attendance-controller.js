const attendanceAbl = require("../abl/attendance/attendance-abl");

const scanCard = async (req, res) => {
    try {
        const result = await attendanceAbl.scanCard(req.body);

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
        const events = await attendanceAbl.getAttendanceEvents();
        return res.status(200).json(events);
    } catch (error) {
        console.error("getAttendanceEvents error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAttendanceEventsByClass = async (req, res) => {
    try {
        const events = await attendanceAbl.getAttendanceEventsByClass(req.params.classId);
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