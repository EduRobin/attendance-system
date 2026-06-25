const express = require("express");
const router = express.Router();
const {
    getStudents,
    getStudentsByClass,
} = require("../controller/student-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.get("/", authMiddleware, requireRole("admin", "teacher"), getStudents);
router.get("/class/:classId", authMiddleware, requireRole("admin", "teacher"), getStudentsByClass);

module.exports = router;