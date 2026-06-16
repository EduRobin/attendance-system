const express = require("express");
const router = express.Router();
const {
    getStudents,
    getStudentsByClass,
} = require("../controller/student-controller");

router.get("/", getStudents);
router.get("/class/:classId", getStudentsByClass);

module.exports = router;