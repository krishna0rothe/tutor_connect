const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: ["Student", "Parent"], // Reference both Student and Parent models
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher", // Event is created by a Teacher
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
