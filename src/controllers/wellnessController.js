const db = require("../database/db");


// Create a wellness reading
const createWellnessReading = (req, res) => {

    const userId = req.user.id;

    const {
        reading_type,
        value,
        unit,
        reading_date,
        notes
    } = req.body;


    // Basic required-field validation
    if (!reading_type || value === undefined || !unit || !reading_date) {
        return res.status(400).json({
            success: false,
            message: "Reading type, value, unit and reading date are required."
        });
    }


    // Make sure the value is numeric
    const numericValue = Number(value);

    if (isNaN(numericValue)) {
        return res.status(400).json({
            success: false,
            message: "Wellness reading value must be numeric."
        });
    }


    // Prevent negative values
    if (numericValue < 0) {
        return res.status(400).json({
            success: false,
            message: "Wellness reading value cannot be negative."
        });
    }


    // Validate reading date
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(reading_date)) {
        return res.status(400).json({
            success: false,
            message: "Reading date must use YYYY-MM-DD format."
        });
    }


    const sql = `
        INSERT INTO wellness_readings
        (
            user_id,
            reading_type,
            value,
            unit,
            reading_date,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.run(
        sql,
        [
            userId,
            reading_type,
            numericValue,
            unit,
            reading_date,
            notes || null
        ],
        function (err) {

            if (err) {
                console.error("Wellness reading error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to save wellness reading."
                });
            }


            return res.status(201).json({
                success: true,
                message: "Wellness reading recorded successfully.",
                reading: {
                    id: this.lastID,
                    user_id: userId,
                    reading_type,
                    value: numericValue,
                    unit,
                    reading_date,
                    notes: notes || null
                }
            });
        }
    );
};



// Get wellness readings for the logged-in user
const getWellnessReadings = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            reading_type,
            value,
            unit,
            reading_date,
            notes
        FROM wellness_readings
        WHERE user_id = ?
        ORDER BY reading_date DESC, id DESC
    `;


    db.all(
        sql,
        [userId],
        (err, readings) => {

            if (err) {
                console.error("Wellness readings error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to retrieve wellness readings."
                });
            }


            return res.status(200).json({
                success: true,
                count: readings.length,
                readings
            });
        }
    );
};



module.exports = {
    createWellnessReading,
    getWellnessReadings
};