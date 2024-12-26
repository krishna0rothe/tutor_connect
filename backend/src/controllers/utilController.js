const Student = require("../models/Student");
const Parent = require("../models/Parent");
const Teacher = require("../models/Teacher");

// Get user information
exports.getUserInfo = async (req, res) => {
  try {
    // `req.user` is set in middleware after JWT verification
    const { id, role } = req.user;

    let user = null;

    // Fetch user details based on role
    if (role === "student") {
      user = await Student.findById(id).select("-password"); // Exclude password
    } else if (role === "parent") {
      user = await Parent.findById(id).select("-password"); // Exclude password
    } else if (role === "teacher") {
      user = await Teacher.findById(id).select("-password"); // Exclude password
    } else {
      return res.status(400).json({ message: "Invalid role." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return user information
    res.status(200).json({
      message: "User information retrieved successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.getUserRole = (req, res) => {
  try {
    const { role } = req.user; // Extract role from req.user set by middleware

    if (!role) {
      return res.status(400).json({ message: "Role not found in user data." });
    }

    res.status(200).json({
      message: "User role retrieved successfully.",
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

