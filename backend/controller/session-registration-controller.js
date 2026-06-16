const SessionRegistration = require("../models/SessionRegistration");
const Session = require("../models/Session");
const Student = require("../models/Student");
const AttendanceRecord = require("../models/AttendanceRecord");

const registerStudentToSession = async (req, res) => {
    try {
        const { sessionId, studentId } = req.body;

        if (!sessionId || !studentId) {
            return res.status(400).json({
                message: "sessionId and studentId are required",
            });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const registration = await SessionRegistration.create({
            sessionId,
            studentId,
        });
        
        await AttendanceRecord.create({
            sessionId,
            studentId,
        });

        return res.status(201).json({
            message: "Student registered to session successfully",
            registration,
        });
    } catch (error) {
        console.error("registerStudentToSession error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Student is already registered to this session",
            });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getRegistrationsBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const registrations = await SessionRegistration.find({ sessionId })
            .populate("studentId", "name cardUid")
            .sort({ createdAt: 1 });

        return res.status(200).json(registrations);
    } catch (error) {
        console.error("getRegistrationsBySession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    registerStudentToSession,
    getRegistrationsBySession,
};