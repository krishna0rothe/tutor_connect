const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  currentStage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stage",
    required: true,
  },
  completedStages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
    },
  ],
  totalStages: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["enrolled", "completed"],
    default: "enrolled",
  },
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
