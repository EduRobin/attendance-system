const Student = require("../../models/Student");

const getStudents = async () => {
    return Student.find().sort({ name: 1 });
};

const getStudentsByClass = async (classId) => {
    return Student.find({ classId }).sort({ name: 1 });
};

module.exports = {
    getStudents,
    getStudentsByClass,
};