const Room = require("../../models/Room");
const Session = require("../../models/Session");

const createRoom = async ({ name, description }) => {
    if (!name) {
        const error = new Error("name is required");
        error.statusCode = 400;
        throw error;
    }

    try {
        const room = await Room.create({
            name,
            description: description || "",
        });

        return {
            message: "Room created successfully",
            room,
        };
    } catch (error) {
        if (error.code === 11000) {
            const duplicateError = new Error("Room with this name already exists");
            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
};

const getRooms = async () => {
    return Room.find().sort({ name: 1 });
};

const getSessionsByRoom = async (id) => {
    const room = await Room.findById(id);

    if (!room) {
        const error = new Error("Room not found");
        error.statusCode = 404;
        throw error;
    }

    const sessions = await Session.find({ roomId: id }).sort({
        startAt: -1,
        createdAt: -1,
    });

    return {
        room,
        sessions,
    };
};

module.exports = {
    createRoom,
    getRooms,
    getSessionsByRoom,
};