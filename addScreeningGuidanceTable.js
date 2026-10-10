const db = require("./src/database/db");

const sql = `
CREATE TABLE IF NOT EXISTS screening_guidance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    screening_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommended_age TEXT,
    recommended_frequency TEXT,
    eligibility_notes TEXT,
    preparation_notes TEXT,
    category TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.run(sql, (error) => {
    if (error) {
        console.error(
            "Failed to create screening_guidance table:",
            error.message
        );
        process.exit(1);
    }

    console.log(
        "screening_guidance table created successfully."
    );

    db.close();
});