const crypto = require("crypto");
const Gateway = require("../../models/Gateway");
const Room = require("../../models/Room");

const createGateway = async ({ name, readerId, roomId }) => {
    if (!name || !readerId || !roomId) {
        const error = new Error("name, readerId and roomId are required");
        error.statusCode = 400;
        throw error;
    }

    const room = await Room.findById(roomId);

    if (!room) {
        const error = new Error("Room not found");
        error.statusCode = 404;
        throw error;
    }

    const deviceToken = crypto.randomBytes(24).toString("hex");

    try {
        const gateway = await Gateway.create({
            name,
            readerId,
            roomId,
            deviceToken,
        });

        return {
            message: "Gateway created successfully",
            gateway,
        };
    } catch (error) {
        if (error.code === 11000) {
            const duplicateError = new Error("Gateway with this readerId already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
};

const getGateways = async () => {
    return Gateway.find()
        .populate("roomId", "name description")
        .sort({ createdAt: -1 });
};

module.exports = {
    createGateway,
    getGateways,
};