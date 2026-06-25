const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token is missing",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-passwordHash");

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "User account is inactive",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("authMiddleware error:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: insufficient permissions",
            });
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    requireRole,
};