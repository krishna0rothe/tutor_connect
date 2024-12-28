const express = require("express");
const router = express.Router();
const { verifyToken , checkRole } = require("../middlewares/authMiddleware");
const studentController = require("../controllers/studentController");

router.get("/courses", verifyToken, checkRole("student"), studentController.getStudentEnrolledCourses);
router.get("/mystudent", verifyToken, studentController.getStudentProgress);
router.get("/getteachers", verifyToken, studentController.getCoursesAndUniqueTeachers);
module.exports = router;
