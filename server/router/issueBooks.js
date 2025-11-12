const express = require("express");
const router = express.Router();
const IssueBook = require("../models/IssueBook");
const Book = require("../models/Book");

// =========================
// Utility: Fine calculation (₹10 per day)
const calculateFine = (record) => {
  if (!record.returnDate) return 0;

  const dueDate = new Date(record.returnDate);
  let actualReturn = record.actualReturnDate
    ? new Date(record.actualReturnDate)
    : new Date(); // today if not returned

  // Reset time for date-only comparison
  dueDate.setHours(0, 0, 0, 0);
  actualReturn.setHours(0, 0, 0, 0);

  const diffTime = actualReturn.getTime() - dueDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays * 10 : 0;
};

// =========================
// GET all issued books (Admin)
router.get("/", async (req, res) => {
  try {
    const records = await IssueBook.find();

    // Auto-update fines for unreturned books
    for (let r of records) {
      const newFine = calculateFine(r);
      if (r.fine !== newFine) {
        r.fine = newFine;
        await r.save();
      }
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// GET issued books of a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const records = await IssueBook.find({ studentId });

    // Auto-update fines for unreturned books
    for (let r of records) {
      const newFine = calculateFine(r);
      if (r.fine !== newFine) {
        r.fine = newFine;
        await r.save();
      }
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// POST issue book
router.post("/", async (req, res) => {
  try {
    const { studentId, studentName, book: bookTitle, issueDate, returnDate } =
      req.body;

    if (!studentId || !studentName || !bookTitle || !issueDate || !returnDate)
      return res.status(400).json({ message: "❌ All fields required" });

    const book = await Book.findOne({ title: bookTitle });
    if (!book) return res.status(404).json({ message: "❌ Book not found" });
    if (book.stock <= 0)
      return res.status(400).json({ message: "❌ Out of stock" });

    // Reduce stock
    book.stock -= 1;
    await book.save();

    const newRecord = new IssueBook({
      studentId,
      studentName,
      book: bookTitle,
      issueDate: new Date(issueDate),
      returnDate: new Date(returnDate),
      fine: 0,
    });

    await newRecord.save();
    res
      .status(201)
      .json({ message: "✅ Book issued successfully", data: newRecord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =========================
// RETURN book
router.put("/return/:id", async (req, res) => {
  try {
    const record = await IssueBook.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "❌ Record not found" });

    // Actual return date = Today
    const now = new Date();
    record.actualReturnDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // ✅ Calculate fine and save
    record.fine = calculateFine(record);
    await record.save();

    // Update book stock
    const book = await Book.findOne({ title: record.book });
    if (book) {
      book.stock += 1;
      await book.save();
    }

    res.json({ message: "✅ Book returned successfully", data: record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// DELETE issued book
router.delete("/:id", async (req, res) => {
  try {
    const record = await IssueBook.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "❌ Record not found" });

    // Increase stock only if book is not returned yet
    if (!record.actualReturnDate) {
      const book = await Book.findOne({ title: record.book });
      if (book) {
        book.stock += 1;
        await book.save();
      }
    }

    await IssueBook.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
