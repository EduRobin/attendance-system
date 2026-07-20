const Student = require("../../models/Student");
const ClassModel = require("../../models/Class");

const getStudents = async () => {
    return Student.find().populate("classId", "name").sort({ name: 1 });
};

const getStudentsByClass = async (classId) => {
    return Student.find({ classId }).sort({ name: 1 });
};

const createStudent = async ({ name, classId, cardUid }) => {
    if (!name) {
        const error = new Error("name is required");
        error.statusCode = 400;
        throw error;
    }

    const studentData = {
        name,
        classId: classId || null,
        isPresent: false,
        lastScanAt: null,
        cardActive: true,
    };

    if (cardUid) {
        studentData.cardUid = cardUid.toLowerCase().trim();
    }

    try {
        const student = await Student.create(studentData);

        return {
            message: "Student created successfully",
            student,
        };
    } catch (error) {
        if (error.code === 11000) {
            const duplicateError = new Error("Student with this card UID already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
};

const assignCardToStudent = async (studentId, { cardUid }) => {
    if (!cardUid) {
        const error = new Error("cardUid is required");
        error.statusCode = 400;
        throw error;
    }

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    student.cardUid = cardUid.toLowerCase().trim();
    student.cardActive = true;

    try {
        await student.save();

        return {
            message: "Card assigned successfully",
            student,
        };
    } catch (error) {
        if (error.code === 11000) {
            const duplicateError = new Error("This card UID is already assigned to another student");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
};

const deactivateStudentCard = async (studentId) => {
    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    student.cardActive = false;
    await student.save();

    return {
        message: "Card deactivated successfully",
        student,
    };
};

module.exports = {
    getStudents,
    getStudentsByClass,
    createStudent,
    assignCardToStudent,
    deactivateStudentCard,
};