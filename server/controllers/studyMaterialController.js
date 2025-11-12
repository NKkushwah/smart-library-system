const StudyMaterial = require("../models/StudyMaterial");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const { title, teacher } = req.body;

    // Use path.normalize to fix Windows/Unix path issues
    const filePath = path.normalize(req.file.path);

    const newMaterial = new StudyMaterial({
      title,
      teacherUsername: teacher,
      filePath: filePath,
      fileType: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    });

    await newMaterial.save();
    res.status(201).json({ msg: "File uploaded successfully", material: newMaterial });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ uploadedAt: -1 });
    res.json(materials);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch materials" });
  }
};

exports.downloadMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ msg: "Material not found" });

    const filePath = path.resolve(material.filePath);

    // Check if file exists before sending
    if (!fs.existsSync(filePath)) return res.status(404).json({ msg: "File not found on server" });

    res.download(filePath, path.basename(filePath));
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ msg: "Download failed" });
  }
};
