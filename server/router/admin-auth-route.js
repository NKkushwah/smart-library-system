const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/admin-auth-controller");

// Routes
router.get("/", adminAuthController.home);
router.post("/register", adminAuthController.register);
router.post("/login", adminAuthController.login);

module.exports = router;
