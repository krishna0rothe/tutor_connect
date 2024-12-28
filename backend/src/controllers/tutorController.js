const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const Progress = require("../models/Progress");
const Student = require("../models/Student");
const Parent = require("../models/Parent");


exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Teacher.find(
      {},
      "name email phone specialization qualification"
    );

    res.status(200).json({
      status: "success",
      message: "Tutors retrieved successfully.",
      tutors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error while retrieving tutors.",
    });
  }
};

exports.findUniqueParents = async (req, res) => {
  const teacherId = req.user.id; // Teacher ID provided by middleware

  try {
    // Step 1: Find all courses created by the teacher
    const courses = await Course.find({ creator: teacherId });

    if (!courses.length) {
      return res
        .status(404)
        .json({
          status: "failed",
          message: "No courses found for this teacher.",
        });
    }

    // Step 2: Extract the enrolled student IDs from the courses
    const enrolledStudentIds = courses.flatMap((course) => course.enrolled);

    if (!enrolledStudentIds.length) {
      return res
        .status(404)
        .json({
          status: "failed",
          message: "No students enrolled in these courses.",
        });
    }

    // Step 3: Find parents whose students are in the enrolled list
    const parents = await Parent.find({
      student: { $in: enrolledStudentIds },
    }).populate("student", "name email"); // Populate student data (name, email)

    if (!parents.length) {
      return res
        .status(404)
        .json({
          status: "failed",
          message: "No parents found for these students.",
        });
    }

    // Step 4: Deduplicate parents
    const uniqueParents = [
      ...new Map(
        parents.map((parent) => [parent._id.toString(), parent])
      ).values(),
    ];

    // Step 5: Prepare response data
    const responseData = uniqueParents.map((parent) => ({
      parentId: parent._id,
      parentName: parent.name,
      parentEmail: parent.email,
      studentId: parent.student._id,
      studentName: parent.student.name,
      studentEmail: parent.student.email,
    }));

    // Step 6: Return the unique parents with their student data
    res.status(200).json({
      status: "success",
      message: "Unique parents found successfully.",
      uniqueParents: responseData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Server error, please try again later.",
      });
  }
};


exports.getTeacherProgress = async (req, res) => {
  const teacherId = req.user.id; // Teacher ID from middleware

  try {
    // Find all courses created by the teacher
    const courses = await Course.find({ creator: teacherId }).populate(
      "creator",
      "name email"
    );
    if (!courses.length) {
      return res
        .status(404)
        .json({ message: "No courses found for this teacher" });
    }

    // Initialize an array to store the response data
    const courseProgress = [];

    // Iterate over each course to get the students enrolled and their progress
    for (const course of courses) {
      const courseData = {
        courseId: course._id,
        courseName: course.name,
        courseDescription: course.description,
        creator: {
          id: course.creator._id,
          name: course.creator.name,
          email: course.creator.email,
        },
        students: [],
      };

      // For each student enrolled in the course, get their progress
      for (const studentId of course.enrolled) {
        // Find the progress for the student in this course
        const progress = await Progress.findOne({
          courseId: course._id,
          studentId,
        }).populate("studentId", "name"); // Populate student details (name)

        if (progress) {
          const completedStages = progress.completedStages || []; // Ensure it defaults to an empty array
          const completedStagesCount = completedStages.length;

          const studentData = {
            student: {
              id: progress.studentId._id, // Student ID from populated studentId
              name: progress.studentId.name, // Student name from populated studentId
            },
            progress: {
              _id: progress._id,
              courseId: progress.courseId,
              currentStage: progress.currentStage,
              completedStages: progress.completedStages,
              totalStages: progress.totalStages,
              status: progress.status,
              completedStagesCount,
            },
          };

          // Add this student's progress to the course data
          courseData.students.push(studentData);
        }
      }

      // Push the course data (with students and their progress) to the response array
      courseProgress.push(courseData);
    }

    // Return the response data
    res.status(200).json({
      teacher: {
        id: teacherId,
        courses: courseProgress,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching teacher progress",
      error: error.message,
    });
  }
};

exports.updateTutorProfile = async (req, res) => {
  const tutorId = req.user.id; // Tutor ID comes from the middleware after authentication

  // Only allow updates to the following fields
  const allowedFields = [
    "name",
    "email",
    "mobile",
    "specialization",
    "qualification",
  ];

  try {
    // Prepare the update data by only including the allowed fields
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    });

    // If no allowed fields are provided for update, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Find the tutor by ID and update the fields
    const updatedTutor = await Teacher.findByIdAndUpdate(
      tutorId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!updatedTutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Return the updated tutor profile
    res.status(200).json({
      message: "User information updated successfully.",
      user: updatedTutor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while updating tutor profile.",
      error: error.message,
    });
  }
};