const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");
const screeningRoutes = require("./routes/screeningRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const contentRoutes = require("./routes/contentRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/screenings", screeningRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "HeartWise Backend API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "HeartWise Backend",
        status: "healthy"
    });
});

app.listen(PORT, () => {
    console.log(
        `HeartWise Backend running on http://localhost:${PORT}`
    );
});