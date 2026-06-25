const Session = require("../../models/Session");
const AttendanceRecord = require("../../models/AttendanceRecord");
const AttendanceEvent = require("../../models/AttendanceEvent");
const Gateway = require("../../models/Gateway");
const closeSessionAbl = require("./close-session-abl");

const getSessionDashboard = async (id) => {
    const session = await Session.findById(id);

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    const gateway = await Gateway.findOne({
        readerId: session.readerId,
        isActive: true,
    }).select("name readerId");

    const records = await AttendanceRecord.find({ sessionId: id })
        .populate("studentId", "name cardUid")
        .sort({ createdAt: 1 });

    const recentEvents = await AttendanceEvent.find({ sessionId: id })
        .populate("studentId", "name cardUid")
        .sort({ timestamp: -1 })
        .limit(20);

    const totalStudents = records.length;
    const presentStudents = records.filter((r) => r.status === "present").length;
    const absentStudents = records.filter(
        (r) => r.status === "absent" || r.status === "not_arrived"
    ).length;
    const wasPresentStudents = records.filter((r) => r.status === "was_present").length;

    return {
        session,
        gateway,
        summary: {
            totalStudents,
            presentStudents,
            absentStudents,
            wasPresentStudents,
        },
        records,
        recentEvents,
    };
};

const createSession = async ({ title, readerId, roomId, startAt, endAt }) => {
    if (!title || !startAt || !endAt || (!readerId && !roomId)) {
        const error = new Error(
            "title, startAt, endAt and either readerId or roomId are required"
        );
        error.statusCode = 400;
        throw error;
    }

    let finalReaderId = readerId;
    let finalRoomId = roomId || null;

    if (roomId) {
        const gateway = await Gateway.findOne({ roomId, isActive: true });

        if (!gateway) {
            const error = new Error("No active gateway found for this room");
            error.statusCode = 404;
            throw error;
        }

        finalReaderId = gateway.readerId;
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        const error = new Error("Invalid date format for startAt or endAt");
        error.statusCode = 400;
        throw error;
    }

    if (endDate <= startDate) {
        const error = new Error("endAt must be later than startAt");
        error.statusCode = 400;
        throw error;
    }

    const conflictingSession = await Session.findOne({
        readerId: finalReaderId,
        startAt: { $lt: endDate },
        endAt: { $gt: startDate },
    });

    if (conflictingSession) {
        const error = new Error("This reader is already booked in the selected time range");
        error.statusCode = 409;
        error.conflictingSession = conflictingSession;
        throw error;
    }

    const session = await Session.create({
        title,
        readerId: finalReaderId,
        roomId: finalRoomId,
        status: "draft",
        scheduledAt: startDate,
        startAt: startDate,
        endAt: endDate,
    });

    return {
        message: "Session created successfully",
        session,
    };
};

const getSessions = async () => {
    return Session.find().sort({ createdAt: -1 });
};

const getSessionById = async (id) => {
    const session = await Session.findById(id);

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    return session;
};

const activateSession = async (id) => {
    const session = await Session.findById(id);

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    const previousActiveSession = await Session.findOne({
        readerId: session.readerId,
        status: "active",
        _id: { $ne: session._id },
    });

    if (previousActiveSession) {
        await closeSessionAbl(previousActiveSession._id);
    }

    session.status = "active";
    await session.save();

    return {
        message: "Session activated successfully",
        session,
        previousActiveSessionClosed: previousActiveSession
            ? previousActiveSession._id
            : null,
    };
};

const closeSession = async (id) => {
    const session = await closeSessionAbl(id);

    return {
        message: "Session closed successfully",
        session,
    };
};

const deleteSession = async (id) => {
    const session = await Session.findById(id);

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    await Session.findByIdAndDelete(id);

    return {
        message: "Session deleted successfully",
    };
};

module.exports = {
    getSessionDashboard,
    createSession,
    getSessions,
    getSessionById,
    activateSession,
    closeSession,
    deleteSession,
};