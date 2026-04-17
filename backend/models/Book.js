const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  serialNo: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  mediaType: { type: String, enum: ['book', 'movie'], default: 'book' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
