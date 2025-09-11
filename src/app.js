const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cors = require("cors");
const routes = require("./route/index.js");

dotenv.config({ quiet: true }); // load env first
connectDB(); // connect to database

const app = express();

app.use(cors());
app.use(express.json());


// Mount routes AFTER middleware
app.use("/api/v1", routes);

// 404 handler
app.use((req, res, next) => {
  return res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
