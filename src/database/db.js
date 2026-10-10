const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database will be stored in the main database folder
const dbPath = path.join(__dirname, "../../database/heartwise.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to HeartWise SQLite database.");
    }
});

module.exports = db;