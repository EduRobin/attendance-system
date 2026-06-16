const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        status: {
            type: String,
            enum: ["absent", "present", "was_present", "not_arrived"],
            default: "absent",
        },
        entryAt: {
            type: Date,
            default: null,
        },
        lastExitAt: {
            type: Date,
            default: null,
        },
        totalPresentSeconds: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

attendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("AttendanceRecord", attendanceRecordSchema);