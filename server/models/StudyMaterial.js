const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teacherUsername: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String },
  url: { type: String }, // frontend download link
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StudyMaterial", studyMaterialSchema);
