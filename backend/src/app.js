const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const utilRoutes = require("./routes/utilRoutes");
const courseRoutes = require("./routes/courseRoutes");
const stageRoutes = require("./routes/stageRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const studentRoutes = require("./routes/studentRoutes");
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
app.use("/api/course", courseRoutes);
app.use("/api/stage", stageRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/student", studentRoutes);

module.exports = app;
