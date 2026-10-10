const db = require("./db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS screening_guidance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            screening_type TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            recommended_age TEXT,
            recommended_frequency TEXT,
            eligibility_notes TEXT,
            preparation_notes TEXT,
            category TEXT,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error("Table creation failed:", err.message);
            db.close();
            return;
        }

        db.get(
            "SELECT COUNT(*) AS total FROM screening_guidance",
            (countError, row) => {
                if (countError) {
                    console.error("Count query failed:", countError.message);
                    db.close();
                    return;
                }

                console.log("Existing guidance records:", row.total);

                if (row.total === 0) {
                    const samples = [
                        [
                            "Blood pressure",
                            "Blood Pressure Screening",
                            "Discuss routine blood pressure checks with a qualified healthcare professional.",
                            "Adults",
                            "Based on individual risk and clinician advice",
                            "Needs vary by age and health history.",
                            "Follow your healthcare professional's instructions.",
                            "General health",
                            1
                        ],
                        [
                            "Diabetes",
                            "Diabetes Screening",
                            "Ask a healthcare professional whether diabetes screening is appropriate for you.",
                            "Depends on age and risk factors",
                            "As advised by a qualified healthcare professional",
                            "Eligibility depends on personal and family history.",
                            "Ask whether fasting or other preparation is required.",
                            "Metabolic health",
                            1
                        ],
                        [
                            "Cervical health",
                            "Cervical Screening Information",
                            "Discuss appropriate cervical screening options with a qualified healthcare professional.",
                            "Depends on age and applicable clinical guidance",
                            "Based on current clinical guidance",
                            "Recommendations depend on age and medical history.",
                            "Ask your healthcare professional about preparation.",
                            "Preventive health",
                            1
                        ]
                    ];

                    const stmt = db.prepare(`
                        INSERT INTO screening_guidance (
                            screening_type, title, description, recommended_age,
                            recommended_frequency, eligibility_notes,
                            preparation_notes, category, is_active
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    for (const sample of samples) {
                        stmt.run(sample);
                    }

                    stmt.finalize((insertError) => {
                        if (insertError) {
                            console.error("Sample insertion failed:", insertError.message);
                        } else {
                            console.log("Sample guidance records inserted.");
                        }

                        verifyAndClose();
                    });
                } else {
                    console.log("Existing records preserved.");
                    verifyAndClose();
                }
            }
        );
    });

    function verifyAndClose() {
        db.all(
            "SELECT id, screening_type, title, category FROM screening_guidance ORDER BY id",
            (error, rows) => {
                if (error) {
                    console.error("Verification failed:", error.message);
                } else {
                    console.log("Verified screening guidance records:");
                    console.table(rows);
                }

                db.close((closeError) => {
                    if (closeError) {
                        console.error("Database close error:", closeError.message);
                    } else {
                        console.log("Screening guidance update finished.");
                    }
                });
            }
        );
    }
});
