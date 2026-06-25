const roomAbl = require("../abl/room/room-abl");

const createRoom = async (req, res) => {
    try {
        const result = await roomAbl.createRoom(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("createRoom error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await roomAbl.getRooms();
        return res.status(200).json(rooms);
    } catch (error) {
        console.error("getRooms error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSessionsByRoom = async (req, res) => {
    try {
        const result = await roomAbl.getSessionsByRoom(req.params.id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("getSessionsByRoom error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createRoom,
    getRooms,
    getSessionsByRoom,
};