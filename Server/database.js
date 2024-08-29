const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create a new SQLite database file
const dbPath = path.join(__dirname, "mydatabase.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Example function to create a table
const createTable = () => {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS formData (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      id_number TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      gender TEXT NOT NULL,
      diploma_name TEXT NOT NULL,
      training_coordinator TEXT NOT NULL
    )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          console.log("Table created or already exists.");
        }
      }
    );
  });
};

// Call the function to create the table
createTable();

// Export the database instance
module.exports = db;
