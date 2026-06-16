const express = require("express");
const router = express.Router();
const {
    createSession,
    getSessions,
    getSessionById,
    activateSession,
    closeSession,
    getSessionDashboard,
    deleteSession,
} = require("../controller/session-controller");

router.post("/", createSession);
router.get("/", getSessions);
router.get("/:id", getSessionById);
router.get("/:id/dashboard", getSessionDashboard);
router.patch("/:id/activate", activateSession);
router.patch("/:id/close", closeSession);
router.delete("/:id", deleteSession);


module.exports = router;