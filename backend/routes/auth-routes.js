const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
} = require("../controller/auth-controller");
const {
    authMiddleware,
} = require("../middleware/auth-middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        user: req.user,
    });
});

module.exports = router;