// backend/routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req,res) => {
  const books = await Book.find();
  res.json(books);
});

// Add new book
router.post('/', async (req,res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// Update book
router.put('/:id', async (req,res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(book);
});

// Delete book
router.delete('/:id', async (req,res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;
