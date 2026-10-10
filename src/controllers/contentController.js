const db = require("../database/db");


// Create educational content
const createContent = (req, res) => {

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
        function (err) {

            if (err) {

                console.error("Content creation error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to create educational content."
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



// Get active educational content
const getContent = (req, res) => {

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
        WHERE is_active = 1
        ORDER BY created_at DESC
    `;


    db.all(sql, [], (err, content) => {

        if (err) {

            console.error("Content retrieval error:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to retrieve educational content."
            });
        }


        return res.status(200).json({
            success: true,
            count: content.length,
            content
        });
    });
};



// Get content by category
const getContentByCategory = (req, res) => {

    const category = req.params.category;


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
        WHERE category = ?
        AND is_active = 1
        ORDER BY created_at DESC
    `;


    db.all(
        sql,
        [category],
        (err, content) => {

            if (err) {

                console.error("Category content error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to retrieve content by category."
                });
            }


            return res.status(200).json({
                success: true,
                count: content.length,
                category,
                content
            });
        }
    );
};



module.exports = {
    createContent,
    getContent,
    getContentByCategory
};