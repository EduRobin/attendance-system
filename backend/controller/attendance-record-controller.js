const attendanceRecordAbl = require("../abl/attendance-record/attendance-record-abl");

const getAttendanceRecordsBySession = async (req, res) => {
    try {
        const records = await attendanceRecordAbl.getAttendanceRecordsBySession(
            req.params.sessionId
        );

        return res.status(200).json(records);
    } catch (error) {
        console.error("getAttendanceRecordsBySession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAttendanceRecordsBySession,
};