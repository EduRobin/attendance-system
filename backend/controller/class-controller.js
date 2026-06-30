const classAbl = require("../abl/class/class-abl");

const getClasses = async (req, res) => {
    try {
        const classes = await classAbl.getClasses();
        return res.status(200).json(classes);
    } catch (error) {
        console.error("getClasses error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getClassById = async (req, res) => {
    try {
        const foundClass = await classAbl.getClassById(req.params.id);
        return res.status(200).json(foundClass);
    } catch (error) {
        console.error("getClassById error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getClassDashboard = async (req, res) => {
    try {
        const result = await classAbl.getClassDashboard(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("getClassDashboard error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getClasses,
    getClassById,
    getClassDashboard,
};