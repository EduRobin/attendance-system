const ClassModel = require("../../models/Class");
const Student = require("../../models/Student");
const AttendanceEvent = require("../../models/AttendanceEvent");

const getClasses = async () => {
    return ClassModel.find().sort({ name: 1 });
};

const getClassById = async (id) => {
    const foundClass = await ClassModel.findById(id);

    if (!foundClass) {
        const error = new Error("Class not found");
        error.statusCode = 404;
        throw error;
    }

    return foundClass;
};

const getClassDashboard = async (id) => {
    const foundClass = await ClassModel.findById(id);

    if (!foundClass) {
        const error = new Error("Class not found");
        error.statusCode = 404;
        throw error;
    }

    const students = await Student.find({ classId: id }).sort({ name: 1 });

    const recentEvents = await AttendanceEvent.find({ classId: id })
        .populate("studentId", "name cardUid")
        .sort({ timestamp: -1 })
        .limit(20);

    return {
        class: foundClass,
        students,
        recentEvents,
    };
};

module.exports = {
    getClasses,
    getClassById,
    getClassDashboard,
};