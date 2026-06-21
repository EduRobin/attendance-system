const Session = require("../models/Session");
const AttendanceRecord = require("../models/AttendanceRecord");
const AttendanceEvent = require("../models/AttendanceEvent");
const Gateway = require("../models/Gateway");

const getSessionDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const records = await AttendanceRecord.find({ sessionId: id })
            .populate("studentId", "name cardUid")
            .sort({ createdAt: 1 });

        const recentEvents = await AttendanceEvent.find({ sessionId: id })
            .populate("studentId", "name cardUid")
            .sort({ timestamp: -1 })
            .limit(20);

        const totalStudents = records.length;
        const presentStudents = records.filter((r) => r.status === "present").length;
        const absentStudents = records.filter((r) => r.status === "absent").length;
        const wasPresentStudents = records.filter((r) => r.status === "was_present").length;

        return res.status(200).json({
            session,
            summary: {
                totalStudents,
                presentStudents,
                absentStudents,
                wasPresentStudents,
            },
            records,
            recentEvents,
        });
    } catch (error) {
        console.error("getSessionDashboard error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createSession = async (req, res) => {
    try {
        const { title, readerId, roomId, startAt, endAt } = req.body;

        if (!title || !startAt || !endAt || (!readerId && !roomId)) {
            return res.status(400).json({
                message: "title, startAt, endAt and either readerId or roomId are required",
            });
        }

        let finalReaderId = readerId;
        let finalRoomId = roomId || null;

        if (roomId) {
            const gateway = await Gateway.findOne({ roomId, isActive: true });

            if (!gateway) {
                return res.status(404).json({
                    message: "No active gateway found for this room",
                });
            }

            finalReaderId = gateway.readerId;
        }

        const startDate = new Date(startAt);
        const endDate = new Date(endAt);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date format for startAt or endAt",
            });
        }

        if (endDate <= startDate) {
            return res.status(400).json({
                message: "endAt must be later than startAt",
            });
        }

        const conflictingSession = await Session.findOne({
            readerId: finalReaderId,
            startAt: { $lt: endDate },
            endAt: { $gt: startDate },
        });

        if (conflictingSession) {
            return res.status(409).json({
                message: "This reader is already booked in the selected time range",
                conflictingSession,
            });
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

        return res.status(201).json({
            message: "Session created successfully",
            session,
        });
    } catch (error) {
        console.error("createSession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        return res.status(200).json(sessions);
    } catch (error) {
        console.error("getSessions error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json(session);
    } catch (error) {
        console.error("getSessionById error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const activateSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const previousActiveSession = await Session.findOne({
            readerId: session.readerId,
            status: "active",
            _id: { $ne: session._id },
        });

        if (previousActiveSession) {
            await AttendanceRecord.updateMany(
                {
                    sessionId: previousActiveSession._id,
                    status: "absent",
                },
                {
                    status: "not_arrived",
                }
            );

            await AttendanceRecord.updateMany(
                {
                    sessionId: previousActiveSession._id,
                    status: "present",
                },
                {
                    status: "was_present",
                }
            );

            previousActiveSession.status = "closed";
            await previousActiveSession.save();
        }

        session.status = "active";
        await session.save();

        return res.status(200).json({
            message: "Session activated successfully",
            session,
            previousActiveSessionClosed: previousActiveSession
                ? previousActiveSession._id
                : null,
        });
    } catch (error) {
        console.error("activateSession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const closeSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        session.status = "closed";
        await session.save();

        return res.status(200).json({
            message: "Session closed successfully",
            session,
        });
    } catch (error) {
        console.error("closeSession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        await Session.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Session deleted successfully",
        });
    } catch (error) {
        console.error("deleteSession error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    activateSession,
    closeSession,
    getSessionDashboard,
    deleteSession,
};