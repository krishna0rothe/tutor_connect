const express = require("express");
const stageController = require("../controllers/stageController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", verifyToken, checkRole("teacher"), stageController.createStage);
router.put("/update/:stageId", verifyToken, checkRole("teacher"), stageController.updateStage);
router.delete("/delete/:stageId", verifyToken, checkRole("teacher"), stageController.deleteStage);
module.exports = router;
