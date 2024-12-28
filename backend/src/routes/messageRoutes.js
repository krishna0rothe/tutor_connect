const express = require("express");
const router = express.Router();
const { verifyToken , checkRole } = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");
const { VirtualType } = require("mongoose");
const { verify } = require("jsonwebtoken");

router.post("/send", verifyToken, messageController.sendMessage); // Route to send a message
router.get("/conversation", verifyToken, messageController.getOrCreateConversation);



module.exports = router;
