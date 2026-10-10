const db = require("../database/db");


// Create a screening record
const createScreening = (req, res) => {

    const userId = req.user.id;

    const {
        screening_type,
        recommended_date,
        completed_date,
        status,
        notes
    } = req.body;


    // Required field validation
    if (!screening_type || !recommended_date) {
        return res.status(400).json({
            success: false,
            message: "Screening type and recommended date are required."
        });
    }


    // Validate status
    const allowedStatuses = [
        "recommended",
        "scheduled",
        "completed",
        "overdue"
    ];

    const screeningStatus = status || "recommended";

    if (!allowedStatuses.includes(screeningStatus)) {
        return res.status(400).json({
            success: false,
            message: "Invalid screening status."
        });
    }


    // Validate recommended date
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(recommended_date)) {
        return res.status(400).json({
            success: false,
            message: "Recommended date must use YYYY-MM-DD format."
        });
    }


    // Validate completed date if provided
    if (completed_date && !datePattern.test(completed_date)) {
        return res.status(400).json({
            success: false,
            message: "Completed date must use YYYY-MM-DD format."
        });
    }


    const sql = `
        INSERT INTO screening_records
        (
            user_id,
            screening_type,
            recommended_date,
            completed_date,
            status,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.run(
        sql,
        [
            userId,
            screening_type,
            recommended_date,
            completed_date || null,
            screeningStatus,
            notes || null
        ],
        function (err) {

            if (err) {

                console.error("Screening record error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to save screening record."
                });
            }


            return res.status(201).json({
                success: true,
                message: "Screening record created successfully.",
                screening: {
                    id: this.lastID,
                    user_id: userId,
                    screening_type,
                    recommended_date,
                    completed_date: completed_date || null,
                    status: screeningStatus,
                    notes: notes || null
                }
            });
        }
    );
};


// Get screening records for logged-in user
const getScreenings = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            screening_type,
            recommended_date,
            completed_date,
            status,
            notes,
            created_at
        FROM screening_records
        WHERE user_id = ?
        ORDER BY recommended_date ASC, id ASC
    `;


    db.all(
        sql,
        [userId],
        (err, screenings) => {

            if (err) {

                console.error("Screening retrieval error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to retrieve screening records."
                });
            }


            return res.status(200).json({
                success: true,
                count: screenings.length,
                screenings
            });
        }
    );
};


// Update a screening record
const updateScreening = (req, res) => {

    const userId = req.user.id;
    const screeningId = req.params.id;

    const {
        recommended_date,
        completed_date,
        status,
        notes
    } = req.body;


    const allowedStatuses = [
        "recommended",
        "scheduled",
        "completed",
        "overdue"
    ];


    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid screening status."
        });
    }


    const datePattern = /^\d{4}-\d{2}-\d{2}$/;


    if (recommended_date && !datePattern.test(recommended_date)) {
        return res.status(400).json({
            success: false,
            message: "Recommended date must use YYYY-MM-DD format."
        });
    }


    if (completed_date && !datePattern.test(completed_date)) {
        return res.status(400).json({
            success: false,
            message: "Completed date must use YYYY-MM-DD format."
        });
    }


    const sql = `
        UPDATE screening_records
        SET
            recommended_date = COALESCE(?, recommended_date),
            completed_date = COALESCE(?, completed_date),
            status = COALESCE(?, status),
            notes = COALESCE(?, notes)
        WHERE id = ?
        AND user_id = ?
    `;


    db.run(
        sql,
        [
            recommended_date || null,
            completed_date || null,
            status || null,
            notes || null,
            screeningId,
            userId
        ],
        function (err) {

            if (err) {

                console.error("Screening update error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to update screening record."
                });
            }


            if (this.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Screening record not found."
                });
            }


            return res.status(200).json({
                success: true,
                message: "Screening record updated successfully."
            });
        }
    );
};


// Get screening guidance
const getScreeningGuidance = (req, res) => {

    const sql = `
        SELECT
            id,
            screening_type,
            title,
            description,
            recommended_age,
            recommended_frequency,
            eligibility_notes,
            preparation_notes,
            category
        FROM screening_guidance
        WHERE is_active = 1
        ORDER BY category ASC, screening_type ASC
    `;


    db.all(
        sql,
        [],
        (error, rows) => {

            if (error) {

                console.error(
                    "Screening guidance retrieval error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve screening guidance."
                });
            }


            return res.status(200).json({
                success: true,
                count: rows.length,
                screening_guidance: rows
            });
        }
    );
};


// Export controller functions
module.exports = {
    createScreening,
    getScreenings,
    updateScreening,
    getScreeningGuidance
};