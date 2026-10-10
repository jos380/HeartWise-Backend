const authenticateToken = require("./authMiddleware");

const requireAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Administrator access is required."
            });
        }

        next();
    });
};

module.exports = requireAdmin;