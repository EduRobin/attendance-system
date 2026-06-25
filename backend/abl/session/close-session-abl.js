const Session = require("../../models/Session");
const AttendanceRecord = require("../../models/AttendanceRecord");

const closeSessionAbl = async (sessionId) => {
    const session = await Session.findById(sessionId);

    if (!session) {
        throw new Error("Session not found");
    }

    await AttendanceRecord.updateMany(
        {
            sessionId: session._id,
            status: "absent",
        },
        {
            status: "not_arrived",
        }
    );

    await AttendanceRecord.updateMany(
        {
            sessionId: session._id,
            status: "present",
        },
        {
            status: "was_present",
        }
    );

    session.status = "closed";
    await session.save();

    return session;
};

module.exports = closeSessionAbl;