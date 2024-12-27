const express = require("express");
const router = express.Router();
const { verifyToken , checkRole } = require("../middlewares/authMiddleware");
const studentController = require("../controllers/studentController");

router.get("/courses", verifyToken, checkRole("student"), studentController.getStudentEnrolledCourses);

module.exports = router;
