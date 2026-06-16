const AttendanceRecord = require("../models/AttendanceRecord");

const getAttendanceRecordsBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const records = await AttendanceRecord.find({ sessionId })
            .populate("studentId", "name cardUid")
            .sort({ createdAt: 1 });

        return res.status(200).json(records);
    } catch (error) {
        console.error("getAttendanceRecordsBySession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getAttendanceRecordsBySession,
};