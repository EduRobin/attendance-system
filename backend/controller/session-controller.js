const sessionAbl = require("../abl/session/session-abl");

const getSessionDashboard = async (req, res) => {
    try {
        const result = await sessionAbl.getSessionDashboard(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("getSessionDashboard error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const createSession = async (req, res) => {
    try {
        const result = await sessionAbl.createSession(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("createSession error:", error);

        if (error.statusCode === 409) {
            return res.status(409).json({
                message: error.message,
                conflictingSession: error.conflictingSession,
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await sessionAbl.getSessions();
        return res.status(200).json(sessions);
    } catch (error) {
        console.error("getSessions error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSessionById = async (req, res) => {
    try {
        const session = await sessionAbl.getSessionById(req.params.id);
        return res.status(200).json(session);
    } catch (error) {
        console.error("getSessionById error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const activateSession = async (req, res) => {
    try {
        const result = await sessionAbl.activateSession(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("activateSession error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const closeSession = async (req, res) => {
    try {
        const result = await sessionAbl.closeSession(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("closeSession error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        if (error.message === "Session not found") {
            return res.status(404).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteSession = async (req, res) => {
    try {
        const result = await sessionAbl.deleteSession(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("deleteSession error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    activateSession,
    closeSession,
    getSessionDashboard,
    deleteSession,
};