const Teacher = require("../models/Teacher");

exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Teacher.find(
      {},
      "name email phone specialization qualification"
    );

    res.status(200).json({
      message: "Tutors retrieved successfully.",
      tutors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while retrieving tutors.",
    });
  }
};
