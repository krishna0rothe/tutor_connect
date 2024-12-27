const Progress = require("../models/Progress");
const Course = require("../models/Course");
const Stage = require("../models/Stage");

exports.getStudentEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id; // Assumes middleware adds `id` to `req.user`.

    const enrolledProgress = await Progress.find({ studentId })
      .populate({
        path: "courseId",
        select: "name description specialization totalStages thumbnail",
        model: Course,
      })
      .populate({
        path: "currentStage",
        select: "title description no",
        model: Stage,
      });

    const formattedCourses = enrolledProgress.map((progress) => ({
      courseId: progress.courseId._id,
      name: progress.courseId.name,
      description: progress.courseId.description,
      specialization: progress.courseId.specialization,
      thumbnail: progress.courseId.thumbnail,
      totalStages: progress.courseId.totalStages,
      progress: {
        currentStage: progress.currentStage,
        completedStages: progress.completedStages,
        totalStages: progress.totalStages,
        status: progress.status,
      },
    }));

    res.status(200).json({
      message: "Enrolled courses retrieved successfully.",
      courses: formattedCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while retrieving enrolled courses.",
    });
  }
};
