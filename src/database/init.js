const db = require("./db");

db.serialize(() => {

    // USERS
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // HEALTH PROFILES
    db.run(`
        CREATE TABLE IF NOT EXISTS health_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date_of_birth TEXT,
            sex TEXT,
            height_cm REAL,
            weight_kg REAL,
            health_goals TEXT,
            risk_factors TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // WELLNESS READINGS
    db.run(`
        CREATE TABLE IF NOT EXISTS wellness_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            reading_type TEXT NOT NULL,
            value REAL NOT NULL,
            unit TEXT,
            reading_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // SCREENING RECORDS
    db.run(`
        CREATE TABLE IF NOT EXISTS screening_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            screening_type TEXT NOT NULL,
            recommended_date TEXT,
            completed_date TEXT,
            status TEXT DEFAULT 'recommended',
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // APPOINTMENTS
    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT,
            provider_name TEXT,
            appointment_type TEXT,
            status TEXT DEFAULT 'scheduled',
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // VISIT PREP
    db.run(`
        CREATE TABLE IF NOT EXISTS visit_prep (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            appointment_id INTEGER,
            questions TEXT,
            symptoms_notes TEXT,
            medication_notes TEXT,
            concerns TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (appointment_id) REFERENCES appointments(id)
        )
    `);

    // EDUCATIONAL CONTENT
    db.run(`
        CREATE TABLE IF NOT EXISTS educational_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content_type TEXT NOT NULL,
            description TEXT,
            content_url TEXT,
            category TEXT,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // COACHING MESSAGES
    db.run(`
        CREATE TABLE IF NOT EXISTS coaching_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            category TEXT,
            target_group TEXT,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ONBOARDING QUESTIONS
    db.run(`
        CREATE TABLE IF NOT EXISTS onboarding_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            question_type TEXT NOT NULL,
            options TEXT,
            is_required INTEGER DEFAULT 0,
            display_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // PERSONALIZATION RULES
    db.run(`
        CREATE TABLE IF NOT EXISTS personalization_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rule_name TEXT NOT NULL,
            condition_field TEXT NOT NULL,
            condition_operator TEXT NOT NULL,
            condition_value TEXT NOT NULL,
            recommendation TEXT NOT NULL,
            priority INTEGER DEFAULT 1,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ADMIN USERS
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("HeartWise database tables initialized successfully.");
});

db.close((err) => {
    if (err) {
        console.error("Error closing database:", err.message);
    } else {
        console.log("Database initialization complete.");
    }
});