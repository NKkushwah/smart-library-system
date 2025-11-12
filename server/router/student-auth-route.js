const express = require("express");
const router = express.Router();
const studentAuthController = require("../controllers/student-auth-controller");

// Home
router.get("/", studentAuthController.home);

// Auth
router.post("/register", studentAuthController.register);
router.post("/login", studentAuthController.login);

// Profile
router.get("/me", studentAuthController.getProfile);
router.put("/me", studentAuthController.updateMyProfile);
router.put("/profile-image", studentAuthController.updateProfileImage);

// Get all students
router.get("/all", studentAuthController.getAllStudents);

module.exports = router;
