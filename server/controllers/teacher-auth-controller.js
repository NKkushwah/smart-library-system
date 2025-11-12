// controllers/teacher-auth-controller.js
const Teacher = require("../models/teacher-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🏠 Home Route
const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to Teacher Auth System 🚀");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 👨‍🏫 Register Teacher
const register = async (req, res) => {
  try {
    const { username, email, phone, password, role, profileImage } = req.body;

    // Check duplicate email
    const teacherExist = await Teacher.findOne({ email });
    if (teacherExist) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const teacherCreated = await Teacher.create({
      username,
      email,
      phone,
      password, // Hashing handled in pre-save hook
      role,
      profileImage: profileImage || "",
    });

    const token = await teacherCreated.generateToken();

    res.status(201).json({
      msg: "Teacher registered successfully",
      teacher: teacherCreated,
      token,
      teacherId: teacherCreated._id.toString(),
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// 🔑 Login Teacher
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const teacherExist = await Teacher.findOne({ email });
    if (!teacherExist) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await teacherExist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    if (role !== "teacher" || teacherExist.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can login here" });
    }

    const token = await teacherExist.generateToken();

    res.status(200).json({
      msg: "Login Successful",
      token,
      teacherId: teacherExist._id.toString(),
      role: teacherExist.role,
      profileImage: teacherExist.profileImage,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ✅ Get logged-in teacher profile
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const teacher = await Teacher.findById(decoded.id).select("-password");

    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });

    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// 🔹 Update Profile Image
const updateProfileImage = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });

    teacher.profileImage = req.body.profileImage; // frontend sends URL/base64
    await teacher.save();

    res.status(200).json({ msg: "Profile image updated", profileImage: teacher.profileImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// 🔹 Update Profile (username, email, phone)
const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });

    const { username, email, phone } = req.body;

    if (!username && !email && !phone) {
      return res.status(400).json({ msg: "At least one field (username, email, phone) is required to update" });
    }

    if (username) teacher.username = username;
    if (email) teacher.email = email;
    if (phone) teacher.phone = phone;

    await teacher.save();

    res.status(200).json({ msg: "Profile updated successfully", teacher });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// 📚 Get All Teachers (for admin dashboard)
const getAllTeachers = async (req, res) => {
  try {
    // include username, email, phone, role (password excluded)
    const teachers = await Teacher.find({}, "username email phone role").sort({ username: 1 });
    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    console.error("Get All Teachers Error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};


// 🔍 Get Single Teacher by ID
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid teacher ID format" });
    }

    const teacher = await Teacher.findById(id).select("-password");
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    res.json(teacher);
  } catch (error) {
    console.error("Get Teacher Error:", error.message);
    res.status(500).json({ error: "Error fetching teacher" });
  }
};

// ✏️ Update Teacher (by admin or self)
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid teacher ID format" });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedTeacher) return res.status(404).json({ error: "Teacher not found" });

    res.json({ message: "Teacher updated successfully", teacher: updatedTeacher });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Error updating teacher" });
  }
};

// ❌ Delete Teacher
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid teacher ID format" });
    }

    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) return res.status(404).json({ error: "Teacher not found" });

    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ error: "Error deleting teacher" });
  }
};

module.exports = {
  home,
  register,
  login,
  getProfile,
  updateProfileImage,
  updateProfile, // ✅ Updated functionality added
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
