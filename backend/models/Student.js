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
            required: false,
            default: null,
        },
        cardUid: {
            type: String,
            required: false,
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true,
            default: null,
        },
        cardActive: {
            type: Boolean,
            default: true,
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