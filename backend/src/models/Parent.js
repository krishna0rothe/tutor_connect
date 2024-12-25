const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null, // Will be populated after student registration
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parent", parentSchema);
