const AttendanceEvent = require("../../models/AttendanceEvent");
const processScan = require("./process-scan-abl");

const scanCard = async ({ uid, readerId, deviceToken }) => {
    if (!uid) {
        const error = new Error("uid is required");
        error.statusCode = 400;
        throw error;
    }

    return processScan(uid, readerId, deviceToken);
};

const getAttendanceEvents = async () => {
    return AttendanceEvent.find()
        .populate("studentId", "name cardUid")
        .sort({ timestamp: -1 });
};

const getAttendanceEventsByClass = async (classId) => {
    return AttendanceEvent.find({ classId })
        .populate("studentId", "name cardUid")
        .sort({ timestamp: -1 });
};

module.exports = {
    scanCard,
    getAttendanceEvents,
    getAttendanceEventsByClass,
};