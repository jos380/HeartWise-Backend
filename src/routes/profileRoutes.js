const express = require("express");

const {
    createProfile,
    getProfile,
    updateProfile
} = require("../controllers/profileController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createProfile);

router.get("/", authenticateToken, getProfile);

router.put("/", authenticateToken, updateProfile);

module.exports = router;