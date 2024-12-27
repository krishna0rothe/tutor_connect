const Course = require("../models/Course");
const Teacher = require("../models/Teacher");
const Progress = require("../models/Progress");
const Stage = require("../models/Stage");

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
        return res.status(400).json({ status: "failed", message: 'All required fields must be provided.' });
    }

    try {
        // Verify that the logged-in user is the creator of the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ status: "failed", message: 'Course not found.' });
        }

        // Ensure the logged-in user is the teacher who created the course
        const creatorId = req.user.id; // Assume `req.user` is populated by middleware
        if (course.creator.toString() !== creatorId) {
            return res.status(403).json({ status: "failed", message: 'You are not authorized to update this course.' });
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
            status: "success",
            message: 'Course updated successfully.',
            course
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: 'Server error, please try again later.' });
    }
}; 

// Get course details by ID with only specific fields
exports.getCourseById = async (req, res) => {
    const { courseId } = req.params;

    try {
        // Find the course by ID and select only the specific fields
        const course = await Course.findById(courseId)
            .select('name description specialization total_stages thumbnail'); // Limit fields to specific ones

        if (!course) {
            return res.status(404).json({ status: "failed", message: 'Course not found.' });
        }

        res.status(200).json({
            status: "success",
            message: "Course retrieved successfully.",
            course,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: 'Server error, please try again later.' });
    }
};

// Get all courses created by the logged-in teacher
exports.getAllCoursesByTutor = async (req, res) => {
    const { id } = req.user; // Extract teacher's ID from the middleware
    

    try {
        // Find all courses created by the teacher
        const courses = await Course.find({ creator: id })
            .populate('content', 'title no') // Optionally populate stages
            .select('-enrolled');          // Exclude the enrolled field for brevity

        if (!courses.length) {
            return res.status(404).json({ status: "failed", message: 'No courses found for this teacher.' });
        }

        res.status(200).json({
            status: "success",
            message: 'Courses retrieved successfully.',
            courses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: 'Server error, please try again later.' });
    }
};

exports.getCourseDetails = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    // Fetch the course by ID and populate the creator and content fields
    const course = await Course.findById(courseId)
      .populate("creator", "name email specialization qualification") // Populates creator details
      .populate({
        path: "content",
        select: "title description no", // Populates stage details
      });

    if (!course) {
      return res.status(404).json({ status: "failed", message: "Course not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Course details retrieved successfully.",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server error, please try again later." });
  }
};


exports.enrollStudentInCourse = async (req, res) => {
  const studentId = req.user.id; // Student ID provided by middleware
  const { courseId } = req.body;

  try {
    // Find the course
    const course = await Course.findById(courseId).populate("content");
    if (!course) {
      return res.status(404).json({ status: "failed", message: "Course not found." });
    }

    // Check if the student is already enrolled
    if (course.enrolled.includes(studentId)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Student is already enrolled in this course." });
    }

    // Get the first stage of the course
    const firstStage = course.content.length > 0 ? course.content[0] : null;
    if (!firstStage) {
      return res.status(400).json({ status: "failed", message: "Course has no stages defined." });
    }

    // Add student to the enrolled list
    course.enrolled.push(studentId);
    await course.save();

    // Create a progress entry for the student
    const progress = new Progress({
      studentId,
      courseId,
      currentStage: firstStage._id,
      totalStages: course.total_stages,
    });
    await progress.save();

    res.status(201).json({
      status: "success",
      message: "Student enrolled successfully and progress created.",
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server error, please try again later." });
  }
};


exports.getMyStudents = async (req, res) => {
  const tutorId = req.user.id; // Tutor ID provided by middleware

  try {
    // Find all courses created by the tutor
    const courses = await Course.find({ creator: tutorId })
      .populate("enrolled", "name email") // Populate enrolled students with name and email
      .select("name description enrolled"); // Select specific fields for response

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ status: "failed", message: "No courses found for this tutor." });
    }

    // Format response
    const response = courses.map((course) => ({
      courseId: course._id,
      courseName: course.name,
      description: course.description,
      enrolledStudents: course.enrolled.map((student) => ({
        id: student._id,
        name: student.name,
        email: student.email,
      })),
      totalEnrolled: course.enrolled.length,
    }));

    res.status(200).json({
      status: "success",
      message: "Students retrieved successfully.",
      response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server error, please try again later." });
  }
};


exports.updateProgress = async (req, res) => {
  const { courseId, stageId } = req.body;
  const studentId = req.user.id; // Provided by middleware

  try {
    // Validate course
    const course = await Course.findById(courseId).populate("content");
    if (!course) {
      return res.status(404).json({ status: "failed", message: "Course not found." });
    }

    // Validate stage
    const stage = await Stage.findById(stageId);
    if (!stage || !course.content.some((s) => s._id.toString() === stageId)) {
      return res
        .status(404)
        .json({ status: "failed", message: "Stage not found in the specified course." });
    }

    // Get progress for the student in this course
    let progress = await Progress.findOne({ studentId, courseId });
    if (!progress) {
      return res
        .status(404)
        .json({
          status: "failed",
          message: "Progress not found for the student in this course.",
        });
    }

    // Check if the stage is already completed
    const stageIndex = course.content.findIndex(
      (s) => s._id.toString() === stageId
    );
    if (stageIndex + 1 <= progress.completedStages) {
      return res.status(200).json({ status: "success", message: "Stage already completed." });
    }

    // Update progress fields
    progress.currentStage = stageId;

    // Increment completedStages only if progressing sequentially
    if (stageIndex + 1 === progress.completedStages + 1) {
      progress.completedStages += 1;
    }

    // Update status if course is completed
    if (progress.completedStages === progress.totalStages) {
      progress.status = "completed";
    }

    await progress.save();

    res.status(200).json({
      status: "success",
      message: "Progress updated successfully.",
      progress: {
        currentStage: progress.currentStage,
        completedStages: progress.completedStages,
        totalStages: progress.totalStages,
        status: progress.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Server error, please try again later." });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate({
        path: "creator",
        select: "name email specialization qualification",
        model: Teacher,
      })
      .populate({
        path: "enrolled",
        select: "name email",
      });

    const formattedCourses = courses.map((course) => ({
      id: course._id,
      name: course.name,
      description: course.description,
      specialization: course.specialization,
      thumbnail: course.thumbnail,
      creator: course.creator,
      totalStages: course.totalStages,
      totalEnrolled: course.enrolled.length,
    }));

    res.status(200).json({
      status: "success",
      message: "Courses retrieved successfully.",
      courses: formattedCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while retrieving courses.",
    });
  }
};



