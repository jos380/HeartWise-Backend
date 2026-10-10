const express = require("express");

const {
    createContent,
    getContent,
    getContentByCategory
} = require("../controllers/contentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createContent);

router.get("/", authenticateToken, getContent);

router.get(
    "/category/:category",
    authenticateToken,
    getContentByCategory
);

module.exports = router;