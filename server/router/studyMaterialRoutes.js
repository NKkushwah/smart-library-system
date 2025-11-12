const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadMaterial, getMaterials, downloadMaterial } = require("../controllers/studyMaterialController");

const router = express.Router();

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("file"), uploadMaterial);
router.get("/", getMaterials);
router.get("/:id/download", downloadMaterial);

module.exports = router;
