const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  stock: Number,
  digital_link: String,
  type: { type: String, enum: ['ebook','journal','magazine','book'] },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
