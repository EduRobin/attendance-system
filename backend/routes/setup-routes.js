const express = require("express");
const router = express.Router();
const { seedDemoData, addTestStudentsToSession } = require("../controller/setup-controller");

router.post("/seed", seedDemoData);
router.post("/add-test-students-to-session", addTestStudentsToSession);

module.exports = router;