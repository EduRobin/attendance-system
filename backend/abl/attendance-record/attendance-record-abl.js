const AttendanceRecord = require("../../models/AttendanceRecord");

const getAttendanceRecordsBySession = async (sessionId) => {
    return AttendanceRecord.find({ sessionId })
        .populate("studentId", "name cardUid")
        .sort({ createdAt: 1 });
};

module.exports = {
    getAttendanceRecordsBySession,
};