const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const utilRoutes = require("./routes/utilRoutes");
//const tutorRoutes = require("./routes/tutorRoutes");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/util", utilRoutes);
//app.use("/api/tutors", tutorRoutes);

module.exports = app;
