const express = require("express");
const router = express.Router();
const {
    createRoom,
    getRooms,
    getSessionsByRoom,
} = require("../controller/room-controller");

router.post("/", createRoom);
router.get("/", getRooms);
router.get("/:id/sessions", getSessionsByRoom);

module.exports = router;