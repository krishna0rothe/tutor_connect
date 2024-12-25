const express = require("express");
const courseController = require("../controllers/courseController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to create a course (restricted to teachers)
router.post("/create", verifyToken, checkRole("teacher"), courseController.createCourse);
router.put("/update/:courseId", verifyToken, checkRole("teacher"), courseController.updateCourse);
router.get("/:courseId", checkRole("teacher"), courseController.getCourseById);

module.exports = router;
