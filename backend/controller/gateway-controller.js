const Gateway = require("../models/Gateway");
const Room = require("../models/Room");

const createGateway = async (req, res) => {
    try {
        const { name, readerId, roomId } = req.body;

        if (!name || !readerId || !roomId) {
            return res.status(400).json({
                message: "name, readerId and roomId are required",
            });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        const gateway = await Gateway.create({
            name,
            readerId,
            roomId,
        });

        return res.status(201).json({
            message: "Gateway created successfully",
            gateway,
        });
    } catch (error) {
        console.error("createGateway error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Gateway with this readerId already exists",
            });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getGateways = async (req, res) => {
    try {
        const gateways = await Gateway.find()
            .populate("roomId", "name description")
            .sort({ createdAt: -1 });

        return res.status(200).json(gateways);
    } catch (error) {
        console.error("getGateways error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createGateway,
    getGateways,
};