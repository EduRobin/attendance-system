const Student = require("../../models/Student");
const Session = require("../../models/Session");
const AttendanceRecord = require("../../models/AttendanceRecord");
const AttendanceEvent = require("../../models/AttendanceEvent");
const Gateway = require("../../models/Gateway");

const SCAN_COOLDOWN_SECONDS = 3;

const processScan = async (uid, readerId, deviceToken) => {
    if (!uid) {
        throw new Error("UID is required");
    }

    if (!readerId) {
        throw new Error("readerId is required");
    }

    if (!deviceToken) {
        const error = new Error("deviceToken is required");
        error.statusCode = 401;
        throw error;
    }

    const gateway = await Gateway.findOne({
        readerId,
        deviceToken,
        isActive: true,
    });

    if (!gateway) {
        const error = new Error("Gateway not found or inactive");
        error.statusCode = 404;
        throw error;
    }

    const activeSession = await Session.findOne({
        roomId: gateway.roomId,
        status: "active",
    });

    if (!activeSession) {
        const error = new Error("No active session found for this room");
        error.statusCode = 404;
        throw error;
    }

    const normalizedUid = uid.toLowerCase().trim();

    const student = await Student.findOne({
        cardUid: normalizedUid,
        cardActive: true,
    });

    if (!student) {
        const error = new Error("Student with this card UID was not found");
        error.statusCode = 404;
        throw error;
    }

    const attendanceRecord = await AttendanceRecord.findOne({
        sessionId: activeSession._id,
        studentId: student._id,
    });

    if (!attendanceRecord) {
        const error = new Error("Student is not registered in the active session");
        error.statusCode = 404;
        throw error;
    }

    const now = new Date();

    if (student.lastScanAt) {
        const diffSeconds =
            (now.getTime() - new Date(student.lastScanAt).getTime()) / 1000;

        if (diffSeconds < SCAN_COOLDOWN_SECONDS) {
            return {
                ignored: true,
                message: "Scan ignored because of cooldown",
                student: {
                    id: student._id,
                    name: student.name,
                    cardUid: student.cardUid,
                },
                session: {
                    id: activeSession._id,
                    title: activeSession.title,
                    status: activeSession.status,
                },
            };
        }
    }

    if (attendanceRecord.status === "was_present") {
        student.lastScanAt = now;
        await student.save();

        return {
            ignored: true,
            message: "Student was already checked out from this session",
            student: {
                id: student._id,
                name: student.name,
                cardUid: student.cardUid,
            },
            session: {
                id: activeSession._id,
                title: activeSession.title,
                status: activeSession.status,
            },
            attendanceRecord,
        };
    }

    let eventType = null;

    if (attendanceRecord.status === "absent") {
        attendanceRecord.status = "present";
        attendanceRecord.entryAt = now;
        eventType = "arrival";
    } else if (attendanceRecord.status === "present") {
        const entryTime = attendanceRecord.entryAt
            ? new Date(attendanceRecord.entryAt)
            : now;

        const diffSeconds = Math.max(
            0,
            Math.floor((now.getTime() - entryTime.getTime()) / 1000)
        );

        attendanceRecord.totalPresentSeconds += diffSeconds;
        attendanceRecord.status = "was_present";
        attendanceRecord.lastExitAt = now;
        eventType = "departure";
    }

    await attendanceRecord.save();

    const event = await AttendanceEvent.create({
        studentId: student._id,
        classId: null,
        sessionId: activeSession._id,
        cardUid: normalizedUid,
        type: eventType,
        timestamp: now,
    });

    student.lastScanAt = now;
    await student.save();

    return {
        ignored: false,
        message: "Scan processed successfully",
        student: {
            id: student._id,
            name: student.name,
            cardUid: student.cardUid,
        },
        session: {
            id: activeSession._id,
            title: activeSession.title,
            status: activeSession.status,
        },
        attendanceRecord: {
            id: attendanceRecord._id,
            status: attendanceRecord.status,
            entryAt: attendanceRecord.entryAt,
            lastExitAt: attendanceRecord.lastExitAt,
            totalPresentSeconds: attendanceRecord.totalPresentSeconds,
        },
        event,
    };
};

module.exports = processScan;