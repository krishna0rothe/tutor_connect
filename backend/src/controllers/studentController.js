const Progress = require("../models/Progress");
const Course = require("../models/Course");
const Stage = require("../models/Stage");
const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Teacher = require("../models/Teacher");

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
      id: progress.courseId._id,
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
      status: "success",
      message: "Enrolled courses retrieved successfully.",
      courses: formattedCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while retrieving enrolled courses.",
    });
  }
};

// For parents
exports.getStudentProgress = async (req, res) => {
  const { id: parentId } = req.user; // Extract parent ID from middleware

  try {
    // Find the parent
    const parent = await Parent.findById(parentId).select("student");
    if (!parent) {
      return res.status(404).json({ status: "failed", message: "Parent not found" });
    }

    // Get the student linked to the parent
    const studentId = parent.student;
    const student = await Student.findById(studentId).select("name");
    if (!student) {
      return res.status(404).json({ status: "failed", message: "Student not found" });
    }

    // Find progress records for the student
    const progressRecords = await Progress.find({ studentId }).select(
      "courseId currentStage completedStages totalStages status"
    );
    if (!progressRecords.length) {
      return res
        .status(404)
        .json({ status: "failed", message: "No progress records found for the student" });
    }

    // Extract course IDs from progress records
    const courseIds = progressRecords.map((record) => record.courseId);

    // Find course details
    const courses = await Course.find({ _id: { $in: courseIds } }).select(
      "name description creator"
    );
    const courseCreators = await Promise.all(
      courses.map((course) =>
        Teacher.findById(course.creator).select("name email")
      )
    );

    // Map courses with progress details and creator information
    const response = courses.map((course, index) => {
      const progress = progressRecords.find(
        (record) => record.courseId.toString() === course._id.toString()
      );
      const creator = courseCreators[index];
      return {
        courseId: course._id,
        courseName: course.name,
        courseDescription: course.description,
        creator: {
          id: creator._id,
          name: creator.name,
          email: creator.email,
        },
        progress: {
          ...progress.toObject(), // Ensure progress data is properly converted to plain object
          completedStagesCount: progress.completedStages.length, // Add completed stages count
        },
      };
    });

    res.status(200).json({
      status: "success",
      message: "Student progress retrieved successfully.",
      student: {
        id: student._id,
        name: student.name,
      },
      courses: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while fetching student progress",
      error: error.message,
    });
  }
};


exports.getCoursesAndUniqueTeachers = async (req, res) => {
  const { id: parentId } = req.user; // Extract parent ID from middleware

  try {
    // Find the parent
    const parent = await Parent.findById(parentId).select("student");
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // Get the student linked to the parent
    const studentId = parent.student;
    const student = await Student.findById(studentId).select("name");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find progress records for the student
    const progressRecords = await Progress.find({ studentId }).select(
      "courseId"
    );
    if (!progressRecords.length) {
      return res
        .status(404)
        .json({ message: "No courses found for the student" });
    }

    // Extract unique course IDs
    const courseIds = [
      ...new Set(progressRecords.map((record) => record.courseId)),
    ];

    // Find course details
    const courses = await Course.find({ _id: { $in: courseIds } }).select(
      "name creator"
    );

    // Extract unique teacher IDs from courses
    const teacherIds = [
      ...new Set(courses.map((course) => course.creator.toString())),
    ];

    // Find teacher details
    const teachers = await Teacher.find({ _id: { $in: teacherIds } }).select(
      "name email"
    );

    // Prepare the response
    const response = {
      student: {
        id: student._id,
        name: student.name,
      },
      courses: courses.map((course) => ({
        id: course._id,
        name: course.name,
      })),
      uniqueTeachers: teachers.map((teacher) => ({
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching courses and teachers",
      error: error.message,
    });
  }
};


exports.getStudentTeachers = async (req, res) => {
  const studentId = req.user.id; // Student ID from middleware

  try {
    // Find courses where the student is enrolled
    const courses = await Course.find({ enrolled: studentId }).populate(
      "creator",
      "name email"
    );

    if (!courses.length) {
      return res
        .status(404)
        .json({ message: "No teachers found for the enrolled courses" });
    }

    // Extract unique teachers from the courses
    const uniqueTeachers = [];
    const teacherSet = new Set();

    courses.forEach((course) => {
      if (course.creator && !teacherSet.has(course.creator._id.toString())) {
        teacherSet.add(course.creator._id.toString());
        uniqueTeachers.push({
          id: course.creator._id,
          name: course.creator.name,
          email: course.creator.email,
        });
      }
    });

    // Return the unique teachers
    res.status(200).json({
      student: {
        id: studentId,
        teachers: uniqueTeachers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching student teachers",
      error: error.message,
    });
  }
};


