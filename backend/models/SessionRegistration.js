const mongoose = require("mongoose");

const sessionRegistrationSchema = new mongoose.Schema(
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
    },
    { timestamps: true }
);

sessionRegistrationSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("SessionRegistration", sessionRegistrationSchema);