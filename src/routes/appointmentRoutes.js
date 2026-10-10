const express = require("express");

const {
    createAppointment,
    getAppointments,
    updateAppointment,
    createVisitPrep,
    getVisitPrep
} = require("../controllers/appointmentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createAppointment);

router.get("/", authenticateToken, getAppointments);

router.put("/:id", authenticateToken, updateAppointment);

router.post("/visit-prep", authenticateToken, createVisitPrep);

router.get("/:appointmentId/visit-prep", authenticateToken, getVisitPrep);

module.exports = router;