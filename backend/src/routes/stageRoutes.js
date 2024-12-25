const express = require("express");
const stageController = require("../controllers/stageController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", verifyToken, checkRole("teacher"), stageController.createStage);

module.exports = router;
