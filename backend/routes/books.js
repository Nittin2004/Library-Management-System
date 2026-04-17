const router = require('express').Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// GET /api/books  — optional ?available=true&title=x&category=x
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.available === 'true') filter.available = true;
    if (req.query.title) filter.title = { $regex: req.query.title, $options: 'i' };
    if (req.query.category) filter.category = { $regex: req.query.category, $options: 'i' };
    const books = await Book.find(filter).sort({ title: 1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/books/:serialNo
router.get('/:serialNo', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ serialNo: req.params.serialNo });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/books/by-title/:title — get first matching book for auto-fill
router.get('/by-title/:title', auth, async (req, res) => {
  try {
    const book = await Book.findOne({ title: { $regex: req.params.title, $options: 'i' } });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books — admin only
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Serial number already exists' });
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/books/:serialNo — admin only
router.put('/:serialNo', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const book = await Book.findOneAndUpdate({ serialNo: req.params.serialNo }, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/books/categories/list — unique categories list
router.get('/categories/list', auth, async (req, res) => {
  try {
    const cats = await Book.distinct('category');
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
