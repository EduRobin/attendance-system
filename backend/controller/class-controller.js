const ClassModel = require("../models/Class");
const Student = require("../models/Student");
const AttendanceEvent = require("../models/AttendanceEvent");

const getClasses = async (req, res) => {
    try {
        const classes = await ClassModel.find().sort({ name: 1 });
        return res.status(200).json(classes);
    } catch (error) {
        console.error("getClasses error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        const foundClass = await ClassModel.findById(id);

        if (!foundClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        return res.status(200).json(foundClass);
    } catch (error) {
        console.error("getClassById error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getClassDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        const foundClass = await ClassModel.findById(id);

        if (!foundClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        const students = await Student.find({ classId: id }).sort({ name: 1 });

        const recentEvents = await AttendanceEvent.find({ classId: id })
            .populate("studentId", "name cardUid")
            .sort({ timestamp: -1 })
            .limit(20);

        return res.status(200).json({
            class: foundClass,
            students,
            recentEvents,
        });
    } catch (error) {
        console.error("getClassDashboard error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getClasses,
    getClassById,
    getClassDashboard,
};