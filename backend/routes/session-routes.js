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
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.get("/", authMiddleware, getSessions);
router.get("/:id", authMiddleware, getSessionById);
router.get("/:id/dashboard", authMiddleware, getSessionDashboard);

router.post("/", authMiddleware, requireRole("admin", "teacher"), createSession);
router.patch("/:id/activate", authMiddleware, requireRole("admin", "teacher"), activateSession);
router.patch("/:id/close", authMiddleware, requireRole("admin", "teacher"), closeSession);
router.delete("/:id", authMiddleware, requireRole("admin", "teacher"), deleteSession);

module.exports = router;