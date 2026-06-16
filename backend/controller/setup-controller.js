const ClassModel = require("../models/Class");
const Student = require("../models/Student");
const Session = require("../models/Session");
const SessionRegistration = require("../models/SessionRegistration");
const AttendanceRecord = require("../models/AttendanceRecord");
const Class = require("../models/Class");

const seedDemoData = async (req, res) => {
    try {
        await Student.deleteMany({});
        await ClassModel.deleteMany({});

        const demoClass = await ClassModel.create({
            name: "3.A",
            readerId: "tapper-1",
        });

        const students = await Student.create([
            {
                name: "Student 1",
                classId: demoClass._id,
                cardUid: "a24697b0",
                isPresent: false,
            },
            {
                name: "Student 2",
                classId: demoClass._id,
                cardUid: "92e499b0",
                isPresent: false,
            },
        ]);

        return res.status(201).json({
            message: "Demo data created successfully",
            class: demoClass,
            students,
        });
    } catch (error) {
        console.error("seedDemoData error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const addTestStudentsToSession = async (req, res) => {
    try {
        const { sessionId, count = 10 } = req.body;

        if (!sessionId) {
            return res.status(400).json({ message: "sessionId is required" });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const existingClass = await Class.findOne();
        if (!existingClass) {
            return res.status(404).json({ message: "No class found in database" });
        }

        const createdStudents = [];

        for (let i = 0; i < count; i++) {
            const uniqueSuffix = `${Date.now()}${i}`;

            const student = await Student.create({
                name: `Test Student ${i + 3}`,
                classId: existingClass._id,
                cardUid: `testuid-${uniqueSuffix}`,
                isPresent: false,
                lastScanAt: null,
            });

            createdStudents.push(student);

            await SessionRegistration.create({
                sessionId,
                studentId: student._id,
            });

            await AttendanceRecord.create({
                sessionId,
                studentId: student._id,
            });
        }

        return res.status(201).json({
            message: "Test students added to session successfully",
            createdStudentsCount: createdStudents.length,
            students: createdStudents,
        });
    } catch (error) {
        console.error("addTestStudentsToSession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    seedDemoData,
    addTestStudentsToSession,
};