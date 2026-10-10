const db = require("./src/database/db");

function showRows(label, sql) {
  db.all(sql, [], (err, rows) => {
    console.log("\n" + label);

    if (err) {
      console.error("Database query failed:", err.message);
      return;
    }

    if (!rows.length) {
      console.log("No records found.");
    } else {
      console.table(rows);
    }
  });
}

db.all(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  [],
  (err, tables) => {
    if (err) {
      console.error("Could not read database tables:", err.message);
      return;
    }

    console.log("DATABASE TABLES");
    console.table(tables);

    showRows(
      "RECENT WELLNESS ENTRIES",
      "SELECT id, user_id, reading_type, value, unit, reading_date FROM wellness_readings ORDER BY id DESC LIMIT 10"
    );

    showRows(
      "RECENT APPOINTMENTS",
      "SELECT id, user_id, appointment_date, appointment_time, appointment_type, status FROM appointments ORDER BY id DESC LIMIT 10"
    );

    showRows(
      "RECENT VISIT PREP RECORDS",
      "SELECT id, user_id, appointment_id, questions, created_at FROM visit_prep ORDER BY id DESC LIMIT 10"
    );
  }
);
