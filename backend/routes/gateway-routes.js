const express = require("express");
const router = express.Router();
const {
    createGateway,
    getGateways,
} = require("../controller/gateway-controller");

router.post("/", createGateway);
router.get("/", getGateways);

module.exports = router;