const mongoose = require("mongoose");

const attendanceEventSchema = new mongoose.Schema(
    {

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: false,
            default: null,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            default: null,
        },
        cardUid: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        type: {
            type: String,
            enum: ["arrival", "departure"],
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AttendanceEvent", attendanceEventSchema);