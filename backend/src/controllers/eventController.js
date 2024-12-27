const Event = require("../models/Event");
const Student = require("../models/Student");
const Parent = require("../models/Parent");

exports.createEvent = async (req, res) => {
  const { title, thumbnail, description, date, time } = req.body;
  const createdBy = req.user.id; // Assuming the teacher's ID is stored in the JWT token after authentication

  // Validate the required fields
  if (!title || !thumbnail || !description || !date || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Convert date and time to a Date object
  const eventDateTime = new Date(`${date}T${time}:00`);

  // Check if the event date and time are in the future
  if (eventDateTime <= new Date()) {
    return res
      .status(400)
      .json({ message: "Event date and time must be in the future" });
  }

  try {
    // Create a new event
    const event = new Event({
      title,
      thumbnail,
      description,
      date,
      time,
      createdBy,
    });

    // Save the event to the database
    await event.save();

    res.status(201).json({
      status: "success",
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while creating event",
    });
  }
};

exports.getUpcomingEvents = async (req, res) => {
  try {
    // Get the current date and time
    const currentDateTime = new Date();

    // Find events where the event date and time is greater than the current date and time
    const upcomingEvents = await Event.find({
      date: { $gte: currentDateTime },
    }).sort({ date: 1 }); // Sort events by date in ascending order

    if (upcomingEvents.length === 0) {
      return res.status(404).json({ message: "No upcoming events found" });
    }

    res.status(200).json({
      status: "success",
      message: "Upcoming events retrieved successfully",
      upcomingEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while fetching upcoming events",
    });
  }
};

exports.getPastEvents = async (req, res) => {
  try {
    // Get the current date and time
    const currentDateTime = new Date();

    // Find events where the event date and time is less than the current date and time
    const pastEvents = await Event.find({
      date: { $lt: currentDateTime },
    }).sort({ date: -1 }); // Sort events by date in descending order (most recent past events first)

    if (pastEvents.length === 0) {
      return res.status(404).json({ message: "No past events found" });
    }

    res.status(200).json({
      status: "success",
      message: "Past events retrieved successfully",
      pastEvents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while fetching past events",
    });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params; // Get event ID from the URL parameters
    const userId = req.user.id; // Get the user's ID from middleware (student or parent)

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is a student or parent
    const student = await Student.findById(userId);
    const parent = await Parent.findById(userId);

    if (!student && !parent) {
      return res
        .status(400)
        .json({ message: "User is neither a student nor a parent" });
    }

    // Add the user to the event attendees (only if they aren't already registered)
    if (event.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    // Add the user ID to the attendees array
    event.attendees.push(userId);
    await event.save(); // Save the event with the updated attendees array

    res.status(200).json({
      status: "success",
      message: "Successfully registered for the event",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while registering for the event",
    });
  }
};

exports.getRegisteredEvents = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from middleware

    // Find events where the userId is in the attendees array
    const events = await Event.find({ attendees: userId });

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for the user" });
    }

    // Return the list of events
    res.status(200).json({
      message: "Registered events fetched successfully",
      events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching events" });
  }
};