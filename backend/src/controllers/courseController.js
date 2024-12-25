const Course = require("../models/Course");
const Teacher = require("../models/Teacher");

// Create a new course
exports.createCourse = async (req, res) => {
  const { name, description, specialization, total_stages } = req.body;

  // Validate required fields
  if (!name || !description || !specialization || !total_stages) {
    return res.status(400).json({
      status: "failed",
      message: "All required fields must be provided.",
    });
  }

  try {
    // Verify that the creator is a valid teacher
    const creatorId = req.user.id; // Assume `req.user` is populated by middleware
    const teacher = await Teacher.findById(creatorId);
    if (!teacher) {
      return res.status(403).json({
        status: "failed",
        message: "Only teachers can create courses.",
      });
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
      status: "success",
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error, please try again later.",
    });
  }
};

// Update course information
exports.updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { name, description, specialization, total_stages, thumbnail } = req.body;

    // Validate required fields
    if (!name || !description || !specialization || !total_stages) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    try {
        // Verify that the logged-in user is the creator of the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Ensure the logged-in user is the teacher who created the course
        const creatorId = req.user.id; // Assume `req.user` is populated by middleware
        if (course.creator.toString() !== creatorId) {
            return res.status(403).json({ message: 'You are not authorized to update this course.' });
        }

        // Update the course fields
        course.name = name;
        course.description = description;
        course.specialization = specialization;
        course.total_stages = total_stages;
        if (thumbnail) course.thumbnail = thumbnail;

        // Save the updated course
        await course.save();

        res.status(200).json({
            message: 'Course updated successfully.',
            course
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};  
