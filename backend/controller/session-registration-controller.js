const sessionRegistrationAbl = require("../abl/session-registration/session-registration-abl");

const registerStudentToSession = async (req, res) => {
    try {
        const result = await sessionRegistrationAbl.registerStudentToSession(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("registerStudentToSession error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getRegistrationsBySession = async (req, res) => {
    try {
        const registrations = await sessionRegistrationAbl.getRegistrationsBySession(
            req.params.sessionId
        );
        return res.status(200).json(registrations);
    } catch (error) {
        console.error("getRegistrationsBySession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    registerStudentToSession,
    getRegistrationsBySession,
};