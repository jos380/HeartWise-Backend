const express = require("express");

const {
    createWellnessReading,
    getWellnessReadings
} = require("../controllers/wellnessController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// Record a wellness reading
router.post(
    "/",
    authenticateToken,
    createWellnessReading
);


// Retrieve wellness readings
router.get(
    "/",
    authenticateToken,
    getWellnessReadings
);


module.exports = router;