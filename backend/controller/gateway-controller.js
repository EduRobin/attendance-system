const gatewayAbl = require("../abl/gateway/gateway-abl");

const createGateway = async (req, res) => {
    try {
        const result = await gatewayAbl.createGateway(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("createGateway error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

const getGateways = async (req, res) => {
    try {
        const gateways = await gatewayAbl.getGateways();
        return res.status(200).json(gateways);
    } catch (error) {
        console.error("getGateways error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createGateway,
    getGateways,
};