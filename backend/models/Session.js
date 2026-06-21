const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        readerId: {
            type: String,
            required: true,
            trim: true,
            default: "tapper-1",

        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: false,
        },
        status: {
            type: String,
            enum: ["draft", "active", "closed"],
            default: "draft",
        },
        scheduledAt: {
            type: Date,
            required: false,
        },
        startAt: {
            type: Date,
            required: true,
        },
        endAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);