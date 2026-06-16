const mqtt = require("mqtt");
const processScan = require("../abl/attendance/process-scan-abl");

const connectMqtt = () => {
    const client = mqtt.connect("mqtt://192.168.8.184:1883");

    client.on("connect", () => {
        console.log("MQTT connected");

        client.subscribe("tapper/+/event/tag", (err) => {
            if (err) {
                console.error("MQTT subscribe error:", err.message);
            } else {
                console.log("Subscribed to tapper tag events");
            }
        });
    });

    client.on("message", async (topic, message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());

            const uid = parsedMessage?.id;

            if (!uid) {
                console.warn("MQTT message does not contain tag UID");
                return;
            }

            const result = await processScan(uid);

            console.log("MQTT scan processed:", {
                ignored: result.ignored,
                message: result.message,
                uid: result.student?.cardUid,
                student: result.student?.name,
                status: result.attendanceRecord?.status,
                eventType: result.event?.type || null,
                sessionTitle: result.session?.title,
            });
        } catch (error) {
            console.error("MQTT message processing error:", error.message);
        }
    });

    client.on("error", (error) => {
        console.error("MQTT client error:", error.message);
    });
};

module.exports = connectMqtt;