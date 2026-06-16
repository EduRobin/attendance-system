const express = require("express");
const router = express.Router();
const {
    registerStudentToSession,
    getRegistrationsBySession,
} = require("../controller/session-registration-controller");

router.post("/", registerStudentToSession);
router.get("/session/:sessionId", getRegistrationsBySession);

module.exports = router;