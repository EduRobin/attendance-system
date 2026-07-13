const mqtt = require("mqtt");
const processScan = require("../abl/attendance/process-scan-abl");

const connectMqtt = () => {
    const client = mqtt.connect(process.env.MQTT_URL, {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
    });

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
            const deviceToken = parsedMessage?.deviceToken;

            const topicParts = topic.split("/");
            const readerId = topicParts[1];

            if (!uid) {
                console.warn("MQTT message does not contain tag UID");
                return;
            }

            if (!readerId) {
                console.warn("MQTT topic does not contain readerId");
                return;
            }

            if (!deviceToken) {
                console.warn("MQTT message does not contain deviceToken");
                return;
            }

            const result = await processScan(uid, readerId, deviceToken);

            console.log("MQTT scan processed:", {
                ignored: result.ignored,
                message: result.message,
                uid: result.student?.cardUid,
                student: result.student?.name,
                status: result.attendanceRecord?.status,
                eventType: result.event?.type || null,
                sessionTitle: result.session?.title,
                readerId,
            });
        } catch (error) {
            console.error("MQTT message processing error:", error);
        }
    });

    client.on("error", (error) => {
        console.error("MQTT client error:", error.message);
    });
};

module.exports = connectMqtt;