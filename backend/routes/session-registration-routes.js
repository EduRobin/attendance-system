const express = require("express");
const router = express.Router();
const {
    registerStudentToSession,
    getRegistrationsBySession,
} = require("../controller/session-registration-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.post("/", authMiddleware, requireRole("admin", "teacher"), registerStudentToSession);
router.get("/session/:sessionId", authMiddleware, requireRole("admin", "teacher"), getRegistrationsBySession);

module.exports = router;