const express = require("express");
const eventController = require("../controllers/eventController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, checkRole("teacher"), eventController.createEvent);
router.get("/upcoming", verifyToken, eventController.getUpcomingEvents);
router.get("/past", verifyToken, eventController.getPastEvents);
router.get("/registered", verifyToken, eventController.getRegisteredEvents);    
router.post("/register/:eventId", verifyToken, eventController.registerForEvent);

module.exports = router;
