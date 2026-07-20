const studentAbl = require("../abl/student/student-abl");

const getStudents = async (req, res) => {
    try {
        const students = await studentAbl.getStudents();
        return res.status(200).json(students);
    } catch (error) {
        console.error("getStudents error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getStudentsByClass = async (req, res) => {
    try {
        const students = await studentAbl.getStudentsByClass(req.params.classId);
        return res.status(200).json(students);
    } catch (error) {
        console.error("getStudentsByClass error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createStudent = async (req, res) => {
    try {
        const result = await studentAbl.createStudent(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("createStudent error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const assignCardToStudent = async (req, res) => {
    try {
        const result = await studentAbl.assignCardToStudent(req.params.id, req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("assignCardToStudent error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const deactivateStudentCard = async (req, res) => {
    try {
        const result = await studentAbl.deactivateStudentCard(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("deactivateStudentCard error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getStudents,
    getStudentsByClass,
    createStudent,
    assignCardToStudent,
    deactivateStudentCard,
};