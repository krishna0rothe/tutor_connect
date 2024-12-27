const express = require("express");
const courseController = require("../controllers/courseController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to create a course (restricted to teachers)
router.post("/create", verifyToken, checkRole("teacher"), courseController.createCourse);
router.get("/getallcourse", verifyToken, checkRole("teacher"), courseController.getAllCoursesByTutor);
router.get("/getall", verifyToken, courseController.getAllCourses);
router.put("/update/:courseId", verifyToken, checkRole("teacher"), courseController.updateCourse);
router.get("/getcourse/:courseId", verifyToken, courseController.getCourseDetails);
router.post("/enroll", verifyToken, checkRole("student"), courseController.enrollStudentInCourse);
router.get("/get/my-students", verifyToken,checkRole("teacher"), courseController.getMyStudents);    
router.get("/get/:courseId", verifyToken,checkRole("teacher"), courseController.getCourseById);
router.post("/updateprogress", verifyToken, checkRole("student"), courseController.updateProgress);
module.exports = router;
