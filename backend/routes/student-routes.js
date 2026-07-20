const express = require("express");
const router = express.Router();
const {
    getStudents,
    getStudentsByClass,
    createStudent,
    assignCardToStudent,
    deactivateStudentCard,
} = require("../controller/student-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.get("/", authMiddleware, requireRole("admin", "teacher"), getStudents);
router.get("/class/:classId", authMiddleware, requireRole("admin", "teacher"), getStudentsByClass);

router.post("/", authMiddleware, requireRole("admin"), createStudent);
router.patch("/:id/card", authMiddleware, requireRole("admin"), assignCardToStudent);
router.patch("/:id/card/deactivate", authMiddleware, requireRole("admin"), deactivateStudentCard);

module.exports = router;