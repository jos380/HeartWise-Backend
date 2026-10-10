const db = require("./src/database/db");

const samples = [
    [
        "Understanding Preventive Healthcare",
        "article",
        "Learn how routine health checks and conversations with qualified healthcare professionals can support preventive care.",
        null,
        "Preventive Health",
        1
    ],
    [
        "Building Healthy Daily Habits",
        "guide",
        "Explore general wellbeing habits such as regular sleep, hydration, balanced meals, and appropriate physical activity.",
        null,
        "Wellness",
        1
    ],
    [
        "Preparing for a Healthcare Appointment",
        "guide",
        "Write down your questions, note symptoms you want to discuss, and bring relevant information to your appointment.",
        null,
        "Appointments",
        1
    ],
    [
        "Understanding Health Screenings",
        "article",
        "Learn what screening tests are intended to do and ask a qualified healthcare professional which options are appropriate for your circumstances.",
        null,
        "Screening",
        1
    ],
    [
        "Making the Most of Health Information",
        "resource",
        "Use reliable health information and discuss questions about online material with a qualified healthcare professional.",
        null,
        "Health Literacy",
        1
    ]
];

db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const insert = db.prepare(`
        INSERT INTO educational_content
        (title, content_type, description, content_url, category, is_active)
        SELECT ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
            SELECT 1 FROM educational_content WHERE title = ?
        )
    `);

    for (const item of samples) {
        insert.run([...item, item[0]]);
    }

    insert.finalize((error) => {
        if (error) {
            console.error("Could not insert educational content:", error.message);
            db.run("ROLLBACK", () => db.close());
            return;
        }

        db.run("COMMIT", (commitError) => {
            if (commitError) {
                console.error("Could not commit educational content:", commitError.message);
            } else {
                console.log("Educational content update completed.");
            }

            db.all(
                `SELECT id, title, content_type, category, is_active
                 FROM educational_content
                 ORDER BY id`,
                (queryError, rows) => {
                    if (queryError) {
                        console.error(queryError.message);
                    } else {
                        console.table(rows);
                    }

                    db.close();
                }
            );
        });
    });
});
