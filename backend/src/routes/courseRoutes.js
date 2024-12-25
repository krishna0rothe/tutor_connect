const express = require("express");
const { createCourse } = require("../controllers/courseController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to create a course (restricted to teachers)
router.post("/create", verifyToken, checkRole("teacher"), createCourse);

module.exports = router;
