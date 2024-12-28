const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const tutorController = require("../controllers/tutorController");

router.get("/all", verifyToken, tutorController.getAllTutors);
router.get("/studentparents", verifyToken, checkRole("teacher"), tutorController.findUniqueParents);
router.get("/mystudents", verifyToken, checkRole("teacher"), tutorController.getTeacherProgress);
router.put("/update", verifyToken, checkRole("teacher"), tutorController.updateTutorProfile);
module.exports = router;
