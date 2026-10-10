const express = require("express");

const {
    createScreening,
    getScreenings,
    updateScreening,
    getScreeningGuidance
} = require("../controllers/screeningController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// Create screening record
router.post(
    "/",
    authenticateToken,
    createScreening
);


// Get user's screening records
router.get(
    "/",
    authenticateToken,
    getScreenings
);


// Get screening guidance
router.get(
    "/guidance",
    authenticateToken,
    getScreeningGuidance
);


// Update screening record
router.put(
    "/:id",
    authenticateToken,
    updateScreening
);


module.exports = router;