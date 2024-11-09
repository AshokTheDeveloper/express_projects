const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const rootDir = require("../utils/pathUtils");

const dbPath = path.join(rootDir, "db", "user.db");

let dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});

const initializeDBAndServer = async (app, PORT) => {
  try {
    await dbPromise;
    app.listen(PORT, () => {
      console.log(`Server started and listens on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error: ", error.message);
    process.exit(1);
  }
};

module.exports = { dbPromise, initializeDBAndServer };

