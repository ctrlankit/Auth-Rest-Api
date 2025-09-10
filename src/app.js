const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/database");
const cors = require("cors");

const app = express();

dotenv.config(); //load env first
connectDB(); //connect to database

app.use(cors());



app.use(express.json());

app.use((req, res, next) => {
  return res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
