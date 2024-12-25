const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// Register new student
router.post("/registerstudent", authController.registerStudent);
router.post("/registerparent", authController.registerParent);
router.post("/registerteacher", authController.registerTeacher);  
router.post("/login", authController.login); 


module.exports = router;
     