const db = require("../database/db");


/*
========================================================
EDUCATIONAL CONTENT
========================================================
*/

// Get all educational content for administrator
const getAdminContent = (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            content_type,
            description,
            content_url,
            category,
            is_active,
            created_at,
            updated_at
        FROM educational_content
        ORDER BY created_at DESC
    `;

    db.all(sql, [], (error, rows) => {

        if (error) {
            console.error("Admin content retrieval error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve educational content."
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            content: rows
        });
    });
};


// Create educational content
const createAdminContent = (req, res) => {

    const {
        title,
        content_type,
        description,
        content_url,
        category,
        is_active
    } = req.body;

    if (!title || !content_type || !description) {
        return res.status(400).json({
            success: false,
            message: "Title, content type and description are required."
        });
    }

    const allowedTypes = [
        "article",
        "video",
        "guide",
        "resource"
    ];

    if (!allowedTypes.includes(content_type)) {
        return res.status(400).json({
            success: false,
            message: "Invalid content type."
        });
    }

    const activeStatus =
        is_active === undefined ? 1 : Number(is_active);

    if (![0, 1].includes(activeStatus)) {
        return res.status(400).json({
            success: false,
            message: "is_active must be 0 or 1."
        });
    }

    const sql = `
        INSERT INTO educational_content
        (
            title,
            content_type,
            description,
            content_url,
            category,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            title,
            content_type,
            description,
            content_url || null,
            category || null,
            activeStatus
        ],
        function (error) {

            if (error) {
                console.error("Admin content creation error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create educational content."
                });
            }

            return res.status(201).json({
                success: true,
                message: "Educational content created successfully.",
                content: {
                    id: this.lastID,
                    title,
                    content_type,
                    description,
                    content_url: content_url || null,
                    category: category || null,
                    is_active: activeStatus
                }
            });
        }
    );
};


// Update educational content
const updateAdminContent = (req, res) => {

    const contentId = req.params.id;

    const {
        title,
        content_type,
        description,
        content_url,
        category,
        is_active
    } = req.body;

    const allowedTypes = [
        "article",
        "video",
        "guide",
        "resource"
    ];

    if (content_type && !allowedTypes.includes(content_type)) {
        return res.status(400).json({
            success: false,
            message: "Invalid content type."
        });
    }

    let activeStatus = null;

    if (is_active !== undefined) {
        activeStatus = Number(is_active);

        if (![0, 1].includes(activeStatus)) {
            return res.status(400).json({
                success: false,
                message: "is_active must be 0 or 1."
            });
        }
    }

    const sql = `
        UPDATE educational_content
        SET
            title = COALESCE(?, title),
            content_type = COALESCE(?, content_type),
            description = COALESCE(?, description),
            content_url = COALESCE(?, content_url),
            category = COALESCE(?, category),
            is_active = COALESCE(?, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            title || null,
            content_type || null,
            description || null,
            content_url || null,
            category || null,
            activeStatus,
            contentId
        ],
        function (error) {

            if (error) {
                console.error("Admin content update error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update educational content."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Educational content not found."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Educational content updated successfully."
            });
        }
    );
};


// Deactivate educational content
const deleteAdminContent = (req, res) => {

    const contentId = req.params.id;

    const sql = `
        UPDATE educational_content
        SET
            is_active = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(
        sql,
        [contentId],
        function (error) {

            if (error) {
                console.error("Admin content deactivation error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to deactivate educational content."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Educational content not found."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Educational content deactivated successfully."
            });
        }
    );
};


/*
========================================================
COACHING MESSAGES
========================================================
*/

// Get coaching messages
const getCoachingMessages = (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            message,
            category,
            target_group,
            is_active,
            created_at
        FROM coaching_messages
        ORDER BY created_at DESC
    `;

    db.all(sql, [], (error, rows) => {

        if (error) {
            console.error("Coaching messages retrieval error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve coaching messages."
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            coaching_messages: rows
        });
    });
};


// Create coaching message
const createCoachingMessage = (req, res) => {

    const {
        title,
        message,
        category,
        target_group,
        is_active
    } = req.body;

    if (!title || !message) {
        return res.status(400).json({
            success: false,
            message: "Title and message are required."
        });
    }

    const activeStatus =
        is_active === undefined ? 1 : Number(is_active);

    if (![0, 1].includes(activeStatus)) {
        return res.status(400).json({
            success: false,
            message: "is_active must be 0 or 1."
        });
    }

    const sql = `
        INSERT INTO coaching_messages
        (
            title,
            message,
            category,
            target_group,
            is_active
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            title,
            message,
            category || null,
            target_group || null,
            activeStatus
        ],
        function (error) {

            if (error) {
                console.error("Coaching message creation error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create coaching message."
                });
            }

            return res.status(201).json({
                success: true,
                message: "Coaching message created successfully.",
                coaching_message: {
                    id: this.lastID,
                    title,
                    message,
                    category: category || null,
                    target_group: target_group || null,
                    is_active: activeStatus
                }
            });
        }
    );
};


/*
========================================================
ONBOARDING QUESTIONS
========================================================
*/

// Get onboarding questions
const getOnboardingQuestions = (req, res) => {

    const sql = `
        SELECT
            id,
            question,
            question_type,
            options,
            is_required,
            display_order,
            is_active,
            created_at
        FROM onboarding_questions
        ORDER BY display_order ASC, id ASC
    `;

    db.all(sql, [], (error, rows) => {

        if (error) {
            console.error("Onboarding questions retrieval error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve onboarding questions."
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            onboarding_questions: rows
        });
    });
};


// Create onboarding question
const createOnboardingQuestion = (req, res) => {

    const {
        question,
        question_type,
        options,
        is_required,
        display_order,
        is_active
    } = req.body;

    if (!question || !question_type) {
        return res.status(400).json({
            success: false,
            message: "Question and question type are required."
        });
    }

    const requiredStatus =
        is_required === undefined ? 0 : Number(is_required);

    const activeStatus =
        is_active === undefined ? 1 : Number(is_active);

    if (![0, 1].includes(requiredStatus)) {
        return res.status(400).json({
            success: false,
            message: "is_required must be 0 or 1."
        });
    }

    if (![0, 1].includes(activeStatus)) {
        return res.status(400).json({
            success: false,
            message: "is_active must be 0 or 1."
        });
    }

    const sql = `
        INSERT INTO onboarding_questions
        (
            question,
            question_type,
            options,
            is_required,
            display_order,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            question,
            question_type,
            options || null,
            requiredStatus,
            display_order || 0,
            activeStatus
        ],
        function (error) {

            if (error) {
                console.error("Onboarding question creation error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create onboarding question."
                });
            }

            return res.status(201).json({
                success: true,
                message: "Onboarding question created successfully.",
                onboarding_question: {
                    id: this.lastID,
                    question,
                    question_type,
                    options: options || null,
                    is_required: requiredStatus,
                    display_order: display_order || 0,
                    is_active: activeStatus
                }
            });
        }
    );
};


/*
========================================================
PERSONALIZATION RULES
========================================================
*/

// Get personalization rules
const getPersonalizationRules = (req, res) => {

    const sql = `
        SELECT
            id,
            rule_name,
            condition_field,
            condition_operator,
            condition_value,
            recommendation,
            priority,
            is_active,
            created_at
        FROM personalization_rules
        ORDER BY priority ASC, id ASC
    `;

    db.all(sql, [], (error, rows) => {

        if (error) {
            console.error("Personalization rules retrieval error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve personalization rules."
            });
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            personalization_rules: rows
        });
    });
};


// Create personalization rule
const createPersonalizationRule = (req, res) => {

    const {
        rule_name,
        condition_field,
        condition_operator,
        condition_value,
        recommendation,
        priority,
        is_active
    } = req.body;

    if (
        !rule_name ||
        !condition_field ||
        !condition_operator ||
        !condition_value ||
        !recommendation
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Rule name, condition field, operator, value and recommendation are required."
        });
    }

    const activeStatus =
        is_active === undefined ? 1 : Number(is_active);

    if (![0, 1].includes(activeStatus)) {
        return res.status(400).json({
            success: false,
            message: "is_active must be 0 or 1."
        });
    }

    const sql = `
        INSERT INTO personalization_rules
        (
            rule_name,
            condition_field,
            condition_operator,
            condition_value,
            recommendation,
            priority,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            rule_name,
            condition_field,
            condition_operator,
            condition_value,
            recommendation,
            priority || 0,
            activeStatus
        ],
        function (error) {

            if (error) {
                console.error("Personalization rule creation error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create personalization rule."
                });
            }

            return res.status(201).json({
                success: true,
                message: "Personalization rule created successfully.",
                personalization_rule: {
                    id: this.lastID,
                    rule_name,
                    condition_field,
                    condition_operator,
                    condition_value,
                    recommendation,
                    priority: priority || 0,
                    is_active: activeStatus
                }
            });
        }
    );
};


/*
========================================================
SCREENING GUIDANCE
========================================================
*/

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
            category,
            is_active,
            created_at,
            updated_at
        FROM screening_guidance
        ORDER BY category ASC, screening_type ASC
    `;

    db.all(sql, [], (error, rows) => {

        if (error) {
            console.error("Screening guidance retrieval error:", error);

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
    });
};


// Create screening guidance
const createScreeningGuidance = (req, res) => {

    const {
        screening_type,
        title,
        description,
        recommended_age,
        recommended_frequency,
        eligibility_notes,
        preparation_notes,
        category,
        is_active
    } = req.body;

    if (!screening_type || !title || !description) {
        return res.status(400).json({
            success: false,
            message:
                "Screening type, title and description are required."
        });
    }

    const activeStatus =
        is_active === undefined ? 1 : Number(is_active);

    if (![0, 1].includes(activeStatus)) {
        return res.status(400).json({
            success: false,
            message: "is_active must be 0 or 1."
        });
    }

    const sql = `
        INSERT INTO screening_guidance
        (
            screening_type,
            title,
            description,
            recommended_age,
            recommended_frequency,
            eligibility_notes,
            preparation_notes,
            category,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            screening_type,
            title,
            description,
            recommended_age || null,
            recommended_frequency || null,
            eligibility_notes || null,
            preparation_notes || null,
            category || null,
            activeStatus
        ],
        function (error) {

            if (error) {
                console.error("Screening guidance creation error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create screening guidance."
                });
            }

            return res.status(201).json({
                success: true,
                message: "Screening guidance created successfully.",
                screening_guidance: {
                    id: this.lastID,
                    screening_type,
                    title,
                    description,
                    recommended_age: recommended_age || null,
                    recommended_frequency: recommended_frequency || null,
                    eligibility_notes: eligibility_notes || null,
                    preparation_notes: preparation_notes || null,
                    category: category || null,
                    is_active: activeStatus
                }
            });
        }
    );
};


// Update screening guidance
const updateScreeningGuidance = (req, res) => {

    const guidanceId = req.params.id;

    const {
        screening_type,
        title,
        description,
        recommended_age,
        recommended_frequency,
        eligibility_notes,
        preparation_notes,
        category,
        is_active
    } = req.body;

    let activeStatus = null;

    if (is_active !== undefined) {

        activeStatus = Number(is_active);

        if (![0, 1].includes(activeStatus)) {
            return res.status(400).json({
                success: false,
                message: "is_active must be 0 or 1."
            });
        }
    }

    const sql = `
        UPDATE screening_guidance
        SET
            screening_type = COALESCE(?, screening_type),
            title = COALESCE(?, title),
            description = COALESCE(?, description),
            recommended_age = COALESCE(?, recommended_age),
            recommended_frequency = COALESCE(?, recommended_frequency),
            eligibility_notes = COALESCE(?, eligibility_notes),
            preparation_notes = COALESCE(?, preparation_notes),
            category = COALESCE(?, category),
            is_active = COALESCE(?, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            screening_type || null,
            title || null,
            description || null,
            recommended_age || null,
            recommended_frequency || null,
            eligibility_notes || null,
            preparation_notes || null,
            category || null,
            activeStatus,
            guidanceId
        ],
        function (error) {

            if (error) {
                console.error("Screening guidance update error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update screening guidance."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Screening guidance not found."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Screening guidance updated successfully."
            });
        }
    );
};


// Deactivate screening guidance
const deleteScreeningGuidance = (req, res) => {

    const guidanceId = req.params.id;

    const sql = `
        UPDATE screening_guidance
        SET
            is_active = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(
        sql,
        [guidanceId],
        function (error) {

            if (error) {
                console.error(
                    "Screening guidance deactivation error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to deactivate screening guidance."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Screening guidance not found."
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Screening guidance deactivated successfully."
            });
        }
    );
};


module.exports = {
    getAdminContent,
    createAdminContent,
    updateAdminContent,
    deleteAdminContent,

    getCoachingMessages,
    createCoachingMessage,

    getOnboardingQuestions,
    createOnboardingQuestion,

    getPersonalizationRules,
    createPersonalizationRule,

    getScreeningGuidance,
    createScreeningGuidance,
    updateScreeningGuidance,
    deleteScreeningGuidance
};