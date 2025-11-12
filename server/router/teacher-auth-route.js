const express = require("express");
const router = express.Router();
const teacherAuthController = require("../controllers/teacher-auth-controller");

// ✅ Home Test Route
router.get("/", teacherAuthController.home);

// ✅ Auth Routes
router.post("/register", teacherAuthController.register);
router.post("/login", teacherAuthController.login);

// ✅ Logged-in teacher routes
router.get("/me", teacherAuthController.getProfile); // get logged-in teacher profile
router.put("/profile-image", teacherAuthController.updateProfileImage); // update profile image
router.put("/me", teacherAuthController.updateProfile); // update logged-in teacher profile
router.get("/all", teacherAuthController.getAllTeachers); // get all teachers (_id + username)

// ✅ Teacher CRUD (optional, admin usage)
router.get("/:id", teacherAuthController.getTeacherById); // get teacher by ID
router.put("/update/:id", teacherAuthController.updateTeacher); // update teacher by ID (admin)
router.delete("/:id", teacherAuthController.deleteTeacher); // delete teacher by ID

module.exports = router;
