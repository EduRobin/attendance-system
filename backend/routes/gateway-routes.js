const express = require("express");
const router = express.Router();
const {
    createGateway,
    getGateways,
} = require("../controller/gateway-controller");
const {
    authMiddleware,
    requireRole,
} = require("../middleware/auth-middleware");

router.get("/", authMiddleware, getGateways);

router.post("/", authMiddleware, requireRole("admin"), createGateway);

module.exports = router;