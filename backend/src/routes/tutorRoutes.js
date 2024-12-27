const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const tutorController = require("../controllers/tutorController");

router.get("/all", verifyToken, tutorController.getAllTutors);

module.exports = router;
