const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    content: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stage",
      },
    ],
    total_stages: {
      type: Number,
      required: true,
    },
    enrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Course", courseSchema);
