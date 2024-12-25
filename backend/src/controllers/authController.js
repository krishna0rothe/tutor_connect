const Student = require("../models/Student");
const Parent = require("../models/Parent"); 
const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Controller to handle student registration
exports.registerStudent = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password || !mobile) {
    return res.status(400).json({
      status: "failed",
      message: "All fields are required: name, email, password, and mobile.",
    });
  }

  try {
    // Check if student already exists by email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(200).json({
        status: "failed",
        message: "Student with this email already exists.",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    // Save the student to the database
    await newStudent.save();

    // Return success response
    res.status(201).json({
      status: "success",
      message: "Student registered successfully.",
      student: {
        name: newStudent.name,
        email: newStudent.email,
        mobile: newStudent.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error, please try again later.",
    });
  }
};



// Parent registration controller
exports.registerParent = async (req, res) => {
  const { name, email, password, mobile, studentEmail } = req.body;

  try {
    // Check if all fields are provided
    if (!name || !email || !password || !mobile || !studentEmail) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required."
      });
    }

    // Check if parent already exists
    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      return res.status(400).json({
        status: "failed",
        message: "Parent with this email already exists."
      });
    }

    // Check if student exists with provided email
    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({
        status: "failed",
        message: "Student not found with the given email."
      });
    }

    // Hash the parent's password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new parent document
    const newParent = new Parent({
      name,
      email,
      password: hashedPassword,
      mobile,
      student: student._id, // Store student's ObjectId in parent
    });

    // Save the parent document
    const savedParent = await newParent.save();

    // Update the student document with the parent's ID
    student.parent = savedParent._id; // Store parent's ObjectId in student
    await student.save();

    // Create JWT token for the parent
    const token = jwt.sign(
      { userId: savedParent._id, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Prepare the response with only required fields
    const parentResponse = {
      name: savedParent.name,
      email: savedParent.email,
      mobile: savedParent.mobile
    };

    res.status(201).json({
      status: "success",
      message: "Parent registered successfully.",
      parent: parentResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error, please try again later."
    });
  }
};


// Controller to handle teacher registration
exports.registerTeacher = async (req, res) => {
  const { name, email, password, mobile, specialization, qualification } =
    req.body;

  // Check if all required fields are provided
  if (
    !name ||
    !email ||
    !password ||
    !mobile ||
    !specialization ||
    !qualification
  ) {
    return res.status(400).json({
      status: "failed",
      message:
        "All fields are required: name, email, password, mobile, specialization, and qualification.",
    });
  }

  try {
    // Check if teacher already exists by email
    const existingTeacherByEmail = await Teacher.findOne({ email });
    if (existingTeacherByEmail) {
      return res.status(200).json({
        status: "failed",
        message: "Teacher with this email already exists.",
      });
    }

    // Check if mobile number already exists
    const existingTeacherByMobile = await Teacher.findOne({ mobile });
    if (existingTeacherByMobile) {
      return res.status(200).json({
        status: "failed",
        message: "Teacher with this mobile number already exists.",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      mobile,
      specialization,
      qualification,
    });

    // Save the teacher to the database
    await newTeacher.save();

    // Return success response
    res.status(201).json({
      status: "success",
      message: "Teacher registered successfully.",
      teacher: {
        name: newTeacher.name,
        email: newTeacher.email,
        mobile: newTeacher.mobile,
        specialization: newTeacher.specialization,
        qualification: newTeacher.qualification,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error, please try again later.",
    });
  }
};






// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            status: "failed",
            message: "Email and password are required."
        });
    }

    try {
        let user = null;
        let role = '';

        // Check if user exists in any model (Student, Parent, Teacher)
        user = await Student.findOne({ email });
        if (user) role = 'student';

        if (!user) {
            user = await Parent.findOne({ email });
            if (user) role = 'parent';
        }

        if (!user) {
            user = await Teacher.findOne({ email });
            if (user) role = 'teacher';
        }

        // If no user found, return a 404 error
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found."
            });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                message: "Invalid password."
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return success response with token
        res.status(200).json({
            status: "success",
            message: "Login successful.",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: "Server error, please try again later."
        });
    }
};

