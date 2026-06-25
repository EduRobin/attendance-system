const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        readerId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        deviceToken: {
            type: String,
            required: true,
            trim: true,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Gateway", gatewaySchema);