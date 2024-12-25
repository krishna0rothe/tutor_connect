const Course = require("../models/Course");
const Teacher = require("../models/Teacher");

// Create a new course
exports.createCourse = async (req, res) => {
  const { name, description, specialization, total_stages } = req.body;

  // Validate required fields
  if (!name || !description || !specialization || !total_stages) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  try {
    // Verify that the creator is a valid teacher
    const creatorId = req.user.id; // Assume `req.user` is populated by middleware
    const teacher = await Teacher.findById(creatorId);
    if (!teacher) {
      return res
        .status(403)
        .json({ message: "Only teachers can create courses." });
    }

    // Create a new course
    const course = new Course({
      name,
      creator: creatorId,
      description,
      specialization,
      total_stages,
      thumbnail: req.body.thumbnail || null, // Optional field
    });

    await course.save();

    res.status(201).json({
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
