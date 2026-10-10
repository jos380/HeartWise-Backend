const db = require("../database/db");

// Create or update health profile
const createProfile = (req, res) => {
    const userId = req.user.id;

    const {
        date_of_birth,
        sex,
        height_cm,
        weight_kg,
        health_goals,
        risk_factors
    } = req.body;

    if (!date_of_birth || !sex) {
        return res.status(400).json({
            success: false,
            message: "Date of birth and sex are required."
        });
    }

    db.get(
        "SELECT id FROM health_profiles WHERE user_id = ?",
        [userId],
        (err, existingProfile) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error."
                });
            }

            if (existingProfile) {
                return res.status(409).json({
                    success: false,
                    message: "Health profile already exists. Use the update endpoint."
                });
            }

            const sql = `
                INSERT INTO health_profiles
                (
                    user_id,
                    date_of_birth,
                    sex,
                    height_cm,
                    weight_kg,
                    health_goals,
                    risk_factors
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [
                    userId,
                    date_of_birth,
                    sex,
                    height_cm || null,
                    weight_kg || null,
                    health_goals || null,
                    risk_factors || null
                ],
                function (err) {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Unable to create health profile."
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "Health profile created successfully.",
                        profile: {
                            id: this.lastID,
                            user_id: userId,
                            date_of_birth,
                            sex,
                            height_cm,
                            weight_kg,
                            health_goals,
                            risk_factors
                        }
                    });
                }
            );
        }
    );
};


// Get health profile
const getProfile = (req, res) => {
    const userId = req.user.id;

    db.get(
        "SELECT * FROM health_profiles WHERE user_id = ?",
        [userId],
        (err, profile) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error."
                });
            }

            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Health profile not found."
                });
            }

            return res.status(200).json({
                success: true,
                profile
            });
        }
    );
};


// Update health profile
const updateProfile = (req, res) => {
    const userId = req.user.id;

    const {
        date_of_birth,
        sex,
        height_cm,
        weight_kg,
        health_goals,
        risk_factors
    } = req.body;

    const sql = `
        UPDATE health_profiles
        SET
            date_of_birth = ?,
            sex = ?,
            height_cm = ?,
            weight_kg = ?,
            health_goals = ?,
            risk_factors = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
    `;

    db.run(
        sql,
        [
            date_of_birth,
            sex,
            height_cm || null,
            weight_kg || null,
            health_goals || null,
            risk_factors || null,
            userId
        ],
        function (err) {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to update health profile."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Health profile not found."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Health profile updated successfully."
            });
        }
    );
};


module.exports = {
    createProfile,
    getProfile,
    updateProfile
};