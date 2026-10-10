const bcrypt = require("bcryptjs");
const db = require("./src/database/db");

const adminName = "HeartWise Demo Administrator";
const adminEmail = "admin@heartwise.test";
const adminPassword = "Admin12345";

bcrypt.hash(adminPassword, 10, (error, passwordHash) => {
    if (error) {
        console.error("Password hashing failed:", error);
        process.exit(1);
    }

    db.run(
        `INSERT OR IGNORE INTO admin_users
        (full_name, email, password_hash)
        VALUES (?, ?, ?)`,
        [adminName, adminEmail, passwordHash],
        function (insertError) {
            if (insertError) {
                console.error(
                    "Administrator creation failed:",
                    insertError.message
                );
                process.exit(1);
            }

            console.log("Administrator account is ready.");
            console.log("Email:", adminEmail);
            console.log("Password:", adminPassword);

            db.close();
        }
    );
});