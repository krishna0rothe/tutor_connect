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
    return res
      .status(400)
      .json({
        message: "All fields are required: name, email, password, and mobile.",
      });
  }

  try {
    // Check if student already exists by email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "Student with this email already exists." });
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
      message: "Student registered successfully.",
      student: {
        name: newStudent.name,
        email: newStudent.email,
        mobile: newStudent.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};


// Controller to handle parent registration
exports.registerParent = async (req, res) => {
    const { name, email, password, mobile } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: 'All fields are required: name, email, password, and mobile.' });
    }

    try {
        // Check if parent already exists by email
        const existingParent = await Parent.findOne({ email });
        if (existingParent) {
            return res.status(400).json({ message: 'Parent with this email already exists.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new parent
        const newParent = new Parent({
            name,
            email,
            password: hashedPassword,
            mobile
        });

        // Save the parent to the database
        await newParent.save();

        // Return success response
        res.status(201).json({
            message: 'Parent registered successfully.',
            parent: { name: newParent.name, email: newParent.email, mobile: newParent.mobile }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};


// Controller to handle teacher registration
exports.registerTeacher = async (req, res) => {
    const { name, email, password, phone, specialization, qualification } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !phone || !specialization || !qualification) {
        return res.status(400).json({ message: 'All fields are required: name, email, password, phone, specialization, and qualification.' });
    }

    try {
        // Check if teacher already exists by email
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher with this email already exists.' });
        }

        // Check if phone number already exists
        const existingPhone = await Teacher.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Teacher with this phone number already exists.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new teacher
        const newTeacher = new Teacher({
            name,
            email,
            password: hashedPassword,
            phone,
            specialization,
            qualification
        });

        // Save the teacher to the database
        await newTeacher.save();

        // Return success response
        res.status(201).json({
            message: 'Teacher registered successfully.',
            teacher: {
                name: newTeacher.name,
                email: newTeacher.email,
                phone: newTeacher.phone,
                specialization: newTeacher.specialization,
                qualification: newTeacher.qualification
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};




// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        let user = null;
        let role = '';

        // Check if user exists in any model
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

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password.' });
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

        // Return token
        res.status(200).json({
            message: 'Login successful.',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};