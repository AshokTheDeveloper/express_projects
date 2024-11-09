// External module
const express = require("express");
const app = express();
const dotEnv = require("dotenv");

// Environment variables
dotEnv.config();

// Core module
const path = require("path");

// Local module
const rootDir = require("./utils/pathUtils");
const { initializeDBAndServer } = require("./utils/dbUtils");
const userRouter = require("./routes/userRouter");

// Making public
app.use(express.static(path.join(__dirname, "public")));

// Parsing body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", userRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

// initializing database
const PORT = process.env.PORT;
initializeDBAndServer(app, PORT);
