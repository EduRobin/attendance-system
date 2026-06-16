const express = require("express");
const router = express.Router();
const {
    getClasses,
    getClassById,
    getClassDashboard,
} = require("../controller/class-controller");

router.get("/", getClasses);
router.get("/:id/dashboard", getClassDashboard);
router.get("/:id", getClassById);

module.exports = router;