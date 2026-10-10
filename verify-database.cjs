const Database = require("better-sqlite3");
const db = new Database("./database/heartwise.db");

console.log("\nDATABASE TABLES:");
console.table(
  db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"
  ).all()
);

console.log("\nRECENT WELLNESS ENTRIES:");
console.table(
  db.prepare(
    "SELECT id, user_id, reading_type, value, unit, reading_date, notes FROM wellness_readings ORDER BY id DESC LIMIT 15"
  ).all()
);

db.close();
