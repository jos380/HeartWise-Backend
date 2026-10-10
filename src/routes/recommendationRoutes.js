const express = require("express");

const {
    getRecommendations
} = require("../controllers/recommendationController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getRecommendations);

module.exports = router;