const SessionRegistration = require("../../models/SessionRegistration");
const Session = require("../../models/Session");
const Student = require("../../models/Student");
const AttendanceRecord = require("../../models/AttendanceRecord");

const registerStudentToSession = async ({ sessionId, studentId }) => {
    if (!sessionId || !studentId) {
        const error = new Error("sessionId and studentId are required");
        error.statusCode = 400;
        throw error;
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    const student = await Student.findById(studentId);
    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    try {
        const registration = await SessionRegistration.create({
            sessionId,
            studentId,
        });

        await AttendanceRecord.create({
            sessionId,
            studentId,
        });

        return {
            message: "Student registered to session successfully",
            registration,
        };
    } catch (error) {
        if (error.code === 11000) {
            const duplicateError = new Error("Student is already registered to this session");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
};

const getRegistrationsBySession = async (sessionId) => {
    return SessionRegistration.find({ sessionId })
        .populate("studentId", "name cardUid")
        .sort({ createdAt: 1 });
};

module.exports = {
    registerStudentToSession,
    getRegistrationsBySession,
};