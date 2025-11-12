const mongoose = require("mongoose");

const issueBookSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  book: { type: String, required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },      // Due date
  actualReturnDate: { type: Date },               // Actual returned date
  fine: { type: Number, default: 0 }             // Fine in Rs
});

module.exports = mongoose.model("IssueBook", issueBookSchema);
