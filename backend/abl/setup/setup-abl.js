const ClassModel = require("../../models/Class");
const Student = require("../../models/Student");
const Session = require("../../models/Session");
const SessionRegistration = require("../../models/SessionRegistration");
const AttendanceRecord = require("../../models/AttendanceRecord");
const Class = require("../../models/Class");

const seedDemoData = async () => {
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

    return {
        message: "Demo data created successfully",
        class: demoClass,
        students,
    };
};

const addTestStudentsToSession = async ({ sessionId, count = 10 }) => {
    if (!sessionId) {
        const error = new Error("sessionId is required");
        error.statusCode = 400;
        throw error;
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    const existingClass = await Class.findOne();
    if (!existingClass) {
        const error = new Error("No class found in database");
        error.statusCode = 404;
        throw error;
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

    return {
        message: "Test students added to session successfully",
        createdStudentsCount: createdStudents.length,
        students: createdStudents,
    };
};

module.exports = {
    seedDemoData,
    addTestStudentsToSession,
};