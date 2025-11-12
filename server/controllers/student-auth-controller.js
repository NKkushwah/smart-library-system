// controllers/student-auth-controller.js
const Student = require("../models/student-model");
const jwt = require("jsonwebtoken");

// ---------------- Home Route ----------------
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to Student Auth System 🚀");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Student Register ----------------
const register = async (req, res) => {
  try {
    let { username, email, phone, password, profileImage } = req.body;

    // ✅ Normalize email
    email = email.trim().toLowerCase();

    // Check existing student
    const studentExist = await Student.findOne({ email });
    if (studentExist) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Create new student
    // ✅ Pre-save middleware will hash the password automatically
    const studentCreated = await Student.create({
      username,
      email,
      phone,
      password,  // raw password
      role: "student", 
      profileImage: profileImage || "",
    });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: studentCreated._id, role: studentCreated.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Student registered successfully",
      token,
      studentId: studentCreated._id.toString(),
      role: studentCreated.role,
      profileImage: studentCreated.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ---------------- Student Login ----------------
const login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // ✅ Normalize email
    email = email.trim().toLowerCase();

    // Find student by email
    const studentExist = await Student.findOne({ email });
    if (!studentExist) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // Compare password
    const isMatch = await studentExist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // Role check
    if (role !== "student" || studentExist.role !== "student") {
      return res.status(403).json({ message: "Only students can login here" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: studentExist._id, role: studentExist.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      msg: "Login Successful",
      token,
      studentId: studentExist._id.toString(),
      role: studentExist.role,
      profileImage: studentExist.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ---------------- Get Logged-in Student Profile ----------------
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const student = await Student.findById(decoded.id).select("-password");

    if (!student) return res.status(404).json({ msg: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ---------------- Update Profile Image ----------------
const updateProfileImage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const student = await Student.findById(decoded.id);

    if (!student) return res.status(404).json({ msg: "Student not found" });

    student.profileImage = req.body.profileImage;
    await student.save();

    res.status(200).json({
      msg: "Profile image updated successfully",
      profileImage: student.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ---------------- Update Profile (username, email, phone, password) ----------------
const updateMyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const student = await Student.findById(decoded.id);

    if (!student) return res.status(404).json({ msg: "Student not found" });

    const { username, email, phone, password } = req.body;

    if (username) student.username = username;
    if (email) student.email = email.trim().toLowerCase();
    if (phone) student.phone = phone;
    if (password) {
      student.password = password; // pre-save middleware will hash it
    }

    await student.save();

    res.status(200).json({ msg: "Profile updated successfully", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ---------------- Get All Students ----------------
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, "_id username").sort({ username: 1 });
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ---------------- Exports ----------------
module.exports = {
  home,
  register,
  login,
  getProfile,
  updateProfileImage,
  updateMyProfile,
  getAllStudents,
};
