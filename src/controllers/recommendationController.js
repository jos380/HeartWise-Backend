const db = require("../database/db");

const getRecommendations = (req, res) => {
    const userId = req.user.id;

    const recommendations = [];

    db.get(
        `SELECT health_goals, risk_factors
         FROM health_profiles
         WHERE user_id = ?`,
        [userId],
        (profileError, profile) => {
            if (profileError) {
                console.error(profileError);

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve health profile."
                });
            }

            if (profile) {
                if (profile.health_goals) {
                    recommendations.push({
                        type: "health_goal",
                        priority: "medium",
                        message: `Continue working toward your health goal: ${profile.health_goals}.`
                    });
                }

                if (
                    profile.risk_factors &&
                    profile.risk_factors.toLowerCase() !== "none reported"
                ) {
                    recommendations.push({
                        type: "risk_factor",
                        priority: "high",
                        message: "Review your reported risk factors and discuss them with an appropriate healthcare professional."
                    });
                }
            }

            db.all(
                `SELECT reading_type, value, unit, reading_date
                 FROM wellness_readings
                 WHERE user_id = ?
                 ORDER BY reading_date DESC
                 LIMIT 10`,
                [userId],
                (wellnessError, readings) => {
                    if (wellnessError) {
                        console.error(wellnessError);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to retrieve wellness readings."
                        });
                    }

                    if (!readings || readings.length === 0) {
                        recommendations.push({
                            type: "wellness_tracking",
                            priority: "medium",
                            message: "Start recording wellness readings so HeartWise can provide more relevant preventive health guidance."
                        });
                    } else {
                        recommendations.push({
                            type: "wellness_tracking",
                            priority: "low",
                            message: "Continue recording your wellness information regularly."
                        });
                    }

                    db.all(
                        `SELECT id, screening_type, recommended_date, status
                         FROM screening_records
                         WHERE user_id = ?
                         AND status IN ('recommended', 'overdue', 'scheduled')
                         ORDER BY recommended_date ASC`,
                        [userId],
                        (screeningError, screenings) => {
                            if (screeningError) {
                                console.error(screeningError);

                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to retrieve screening information."
                                });
                            }

                            if (screenings && screenings.length > 0) {
                                screenings.forEach((screening) => {
                                    recommendations.push({
                                        type: "screening",
                                        screening_id: screening.id,
                                        screening_type: screening.screening_type,
                                        recommended_date: screening.recommended_date,
                                        status: screening.status,
                                        priority:
                                            screening.status === "overdue"
                                                ? "high"
                                                : "medium",
                                        message:
                                            screening.status === "overdue"
                                                ? `Review your overdue screening: ${screening.screening_type}.`
                                                : `Review your recommended screening: ${screening.screening_type}.`
                                    });
                                });
                            } else {
                                recommendations.push({
                                    type: "screening",
                                    priority: "low",
                                    message: "Review your preventive screening information regularly."
                                });
                            }

                            res.json({
                                success: true,
                                message: "Personalized recommendations generated successfully.",
                                disclaimer:
                                    "HeartWise is an educational prototype using synthetic data and does not provide medical diagnosis or treatment.",
                                recommendations
                            });
                        }
                    );
                }
            );
        }
    );
};

module.exports = {
    getRecommendations
};