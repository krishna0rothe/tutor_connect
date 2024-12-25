const express = require("express");
const utilController = require("../controllers/utilController");
const {verifyToken} = require("../middlewares/authMiddleware");
const router = express.Router();

// Register new student
router.get("/me", verifyToken, utilController.getUserInfo);



module.exports = router;
     