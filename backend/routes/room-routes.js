const express = require("express");
const router = express.Router();
const {
    createRoom,
    getRooms,
    getSessionsByRoom,
} = require("../controller/room-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.get("/", authMiddleware, getRooms);
router.get("/:id/sessions", authMiddleware, getSessionsByRoom);

router.post("/", authMiddleware, requireRole("admin"), createRoom);

module.exports = router;