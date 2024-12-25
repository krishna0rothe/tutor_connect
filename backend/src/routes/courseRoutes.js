const express = require("express");
const courseController = require("../controllers/courseController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to create a course (restricted to teachers)
router.post("/create", verifyToken, checkRole("teacher"), courseController.createCourse);
router.put("/update", verifyToken, checkRole("teacher"), courseController.updateCourse);

module.exports = router;
