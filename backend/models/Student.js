const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        cardUid: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        isPresent: {
            type: Boolean,
            default: false,
        },
        lastScanAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);