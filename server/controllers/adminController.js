const Book = require('../models/Book');
const User = require('../models/User');
const IssueLog = require('../models/IssueLog');
const Notification = require('../models/Notification');
const generateReport = require('../utils/generateReport');

// Add Book
exports.addBook = async (req,res)=>{
  try{
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  }catch(err){ res.status(500).json({ error: err.message }); }
};

// Get All Books
exports.getBooks = async (req,res)=>{
  try{
    const books = await Book.find();
    res.json(books);
  }catch(err){ res.status(500).json({ error: err.message }); }
};

// Update Book
exports.updateBook = async (req,res)=>{
  try{
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json(book);
  }catch(err){ res.status(500).json({ error: err.message }); }
};

// Delete Book
exports.deleteBook = async (req,res)=>{
  try{
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message:'Book deleted successfully' });
  }catch(err){ res.status(500).json({ error: err.message }); }
};

// Get Issue Logs
exports.getIssueLogs = async (req,res)=>{
  const logs = await IssueLog.find().populate('user').populate('book');
  res.json(logs);
};

// Generate PDF/Excel Report
exports.getReport = async (req,res)=>{
  const reportBuffer = await generateReport();
  res.setHeader('Content-Type','application/pdf');
  res.send(reportBuffer);
};
