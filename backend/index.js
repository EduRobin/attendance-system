const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const attendanceRoutes = require("./routes/attendance-routes");
const setupRoutes = require("./routes/setup-routes");
const studentRoutes = require("./routes/student-routes");
const classRoutes = require("./routes/class-routes");
const connectMqtt = require("./config/mqtt");
const sessionRoutes = require("./routes/session-routes");
const sessionRegistrationRoutes = require("./routes/session-registration-routes");
const attendanceRecordRoutes = require("./routes/attendance-record-routes");
const roomRoutes = require("./routes/room-routes");
const gatewayRoutes = require("./routes/gateway-routes");
const authRoutes = require("./routes/auth-routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Attendance System API is running",
  });
});

app.use("/api/attendance", attendanceRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/session-registrations", sessionRegistrationRoutes);
app.use("/api/attendance-records", attendanceRecordRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/gateways", gatewayRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  connectMqtt();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
});