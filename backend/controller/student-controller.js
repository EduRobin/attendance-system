const Student = require("../models/Student");

const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        return res.status(200).json(students);
    } catch (error) {
        console.error("getStudents error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const students = await Student.find({ classId }).sort({ name: 1 });

        return res.status(200).json(students);
    } catch (error) {
        console.error("getStudentsByClass error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getStudents,
    getStudentsByClass,
};