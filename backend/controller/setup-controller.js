const setupAbl = require("../abl/setup/setup-abl");

const seedDemoData = async (req, res) => {
    try {
        const result = await setupAbl.seedDemoData();
        return res.status(201).json(result);
    } catch (error) {
        console.error("seedDemoData error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const addTestStudentsToSession = async (req, res) => {
    try {
        const result = await setupAbl.addTestStudentsToSession(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("addTestStudentsToSession error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    seedDemoData,
    addTestStudentsToSession,
};