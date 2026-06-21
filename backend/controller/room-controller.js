const Room = require("../models/Room");
const Session = require("../models/Session");

const createRoom = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "name is required",
            });
        }

        const room = await Room.create({
            name,
            description: description || "",
        });

        return res.status(201).json({
            message: "Room created successfully",
            room,
        });
    } catch (error) {
        console.error("createRoom error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Room with this name already exists",
            });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ name: 1 });

        return res.status(200).json(rooms);
    } catch (error) {
        console.error("getRooms error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSessionsByRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        const sessions = await Session.find({ roomId: id }).sort({ startAt: -1, createdAt: -1 });

        return res.status(200).json({
            room,
            sessions,
        });
    } catch (error) {
        console.error("getSessionsByRoom error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createRoom,
    getRooms,
    getSessionsByRoom,
};