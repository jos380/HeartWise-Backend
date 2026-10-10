const db = require("../database/db");


// Create an appointment
const createAppointment = (req, res) => {

    const userId = req.user.id;

    const {
        appointment_date,
        appointment_time,
        provider_name,
        appointment_type,
        status,
        notes
    } = req.body;


    if (!appointment_date || !appointment_time || !appointment_type) {
        return res.status(400).json({
            success: false,
            message: "Appointment date, time and type are required."
        });
    }


    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!datePattern.test(appointment_date)) {
        return res.status(400).json({
            success: false,
            message: "Appointment date must use YYYY-MM-DD format."
        });
    }


    if (!timePattern.test(appointment_time)) {
        return res.status(400).json({
            success: false,
            message: "Appointment time must use HH:MM format."
        });
    }


    const allowedStatuses = [
        "scheduled",
        "completed",
        "cancelled"
    ];

    const appointmentStatus = status || "scheduled";

    if (!allowedStatuses.includes(appointmentStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid appointment status."
        });
    }


    const sql = `
        INSERT INTO appointments
        (
            user_id,
            appointment_date,
            appointment_time,
            provider_name,
            appointment_type,
            status,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;


    db.run(
        sql,
        [
            userId,
            appointment_date,
            appointment_time,
            provider_name || null,
            appointment_type,
            appointmentStatus,
            notes || null
        ],
        function (err) {

            if (err) {
                console.error("Appointment creation error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to create appointment."
                });
            }


            return res.status(201).json({
                success: true,
                message: "Appointment created successfully.",
                appointment: {
                    id: this.lastID,
                    user_id: userId,
                    appointment_date,
                    appointment_time,
                    provider_name: provider_name || null,
                    appointment_type,
                    status: appointmentStatus,
                    notes: notes || null
                }
            });
        }
    );
};



// Get appointments for logged-in user
const getAppointments = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            appointment_date,
            appointment_time,
            provider_name,
            appointment_type,
            status,
            notes,
            created_at
        FROM appointments
        WHERE user_id = ?
        ORDER BY appointment_date ASC, appointment_time ASC
    `;


    db.all(
        sql,
        [userId],
        (err, appointments) => {

            if (err) {
                console.error("Appointment retrieval error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to retrieve appointments."
                });
            }


            return res.status(200).json({
                success: true,
                count: appointments.length,
                appointments
            });
        }
    );
};



// Update an appointment
const updateAppointment = (req, res) => {

    const userId = req.user.id;
    const appointmentId = req.params.id;

    const {
        appointment_date,
        appointment_time,
        provider_name,
        appointment_type,
        status,
        notes
    } = req.body;


    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;


    if (
        appointment_date &&
        !datePattern.test(appointment_date)
    ) {
        return res.status(400).json({
            success: false,
            message: "Appointment date must use YYYY-MM-DD format."
        });
    }


    if (
        appointment_time &&
        !timePattern.test(appointment_time)
    ) {
        return res.status(400).json({
            success: false,
            message: "Appointment time must use HH:MM format."
        });
    }


    const allowedStatuses = [
        "scheduled",
        "completed",
        "cancelled"
    ];


    if (
        status &&
        !allowedStatuses.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid appointment status."
        });
    }


    const sql = `
        UPDATE appointments
        SET
            appointment_date = COALESCE(?, appointment_date),
            appointment_time = COALESCE(?, appointment_time),
            provider_name = COALESCE(?, provider_name),
            appointment_type = COALESCE(?, appointment_type),
            status = COALESCE(?, status),
            notes = COALESCE(?, notes)
        WHERE id = ?
        AND user_id = ?
    `;


    db.run(
        sql,
        [
            appointment_date || null,
            appointment_time || null,
            provider_name || null,
            appointment_type || null,
            status || null,
            notes || null,
            appointmentId,
            userId
        ],
        function (err) {

            if (err) {
                console.error("Appointment update error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to update appointment."
                });
            }


            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found."
                });
            }


            return res.status(200).json({
                success: true,
                message: "Appointment updated successfully."
            });
        }
    );
};



// Create Visit Prep information
const createVisitPrep = (req, res) => {

    const userId = req.user.id;

    const {
        appointment_id,
        questions,
        symptoms_notes,
        medication_notes,
        concerns
    } = req.body;


    if (!appointment_id) {
        return res.status(400).json({
            success: false,
            message: "Appointment ID is required."
        });
    }


    // Make sure the appointment belongs to the logged-in user
    const appointmentSql = `
        SELECT id
        FROM appointments
        WHERE id = ?
        AND user_id = ?
    `;


    db.get(
        appointmentSql,
        [appointment_id, userId],
        (err, appointment) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error."
                });
            }


            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: "Appointment not found."
                });
            }


            const sql = `
                INSERT INTO visit_prep
                (
                    user_id,
                    appointment_id,
                    questions,
                    symptoms_notes,
                    medication_notes,
                    concerns
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;


            db.run(
                sql,
                [
                    userId,
                    appointment_id,
                    questions || null,
                    symptoms_notes || null,
                    medication_notes || null,
                    concerns || null
                ],
                function (err) {

                    if (err) {
                        console.error("Visit prep error:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Unable to save visit preparation."
                        });
                    }


                    return res.status(201).json({
                        success: true,
                        message: "Visit preparation saved successfully.",
                        visit_prep: {
                            id: this.lastID,
                            user_id: userId,
                            appointment_id,
                            questions: questions || null,
                            symptoms_notes: symptoms_notes || null,
                            medication_notes: medication_notes || null,
                            concerns: concerns || null
                        }
                    });
                }
            );
        }
    );
};



// Get Visit Prep for an appointment
const getVisitPrep = (req, res) => {

    const userId = req.user.id;
    const appointmentId = req.params.appointmentId;


    const sql = `
        SELECT
            id,
            appointment_id,
            questions,
            symptoms_notes,
            medication_notes,
            concerns,
            created_at,
            updated_at
        FROM visit_prep
        WHERE appointment_id = ?
        AND user_id = ?
        ORDER BY id DESC
    `;


    db.all(
        sql,
        [appointmentId, userId],
        (err, visitPrep) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to retrieve visit preparation."
                });
            }


            return res.status(200).json({
                success: true,
                count: visitPrep.length,
                visit_prep: visitPrep
            });
        }
    );
};



module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    createVisitPrep,
    getVisitPrep
};