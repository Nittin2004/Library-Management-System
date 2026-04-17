const router = require('express').Router();
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const FINE_PER_DAY = 5; // ₹5 per day

// POST /api/issues — issue a book
router.post('/', auth, async (req, res) => {
  try {
    const { bookSerialNo, bookTitle, authorName, membershipNo, borrowerName, issueDate, scheduledReturn, remarks } = req.body;
    // Mark book unavailable
    await Book.findOneAndUpdate({ serialNo: bookSerialNo }, { available: false });
    const issue = new Issue({ bookSerialNo, bookTitle, authorName, membershipNo, borrowerName, issueDate, scheduledReturn, remarks, status: 'issued' });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/issues/book/:serialNo — get active issue for a book
router.get('/book/:serialNo', auth, async (req, res) => {
  try {
    const issue = await Issue.findOne({ bookSerialNo: req.params.serialNo, status: 'issued' });
    if (!issue) return res.status(404).json({ message: 'No active issue found for this book' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/issues — all issues
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/issues/:id/return — return book, compute fine
router.put('/:id/return', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue record not found' });
    const { actualReturn, remarks } = req.body;
    const returnDate = new Date(actualReturn);
    const scheduled = new Date(issue.scheduledReturn);
    let fine = 0;
    if (returnDate > scheduled) {
      const diffMs = returnDate - scheduled;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      fine = diffDays * FINE_PER_DAY;
    }
    issue.actualReturn = returnDate;
    issue.fineAmount = fine;
    issue.remarks = remarks || issue.remarks;
    // Don't close yet — user must pay fine on next step
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/issues/:id/payfine — confirm fine paid and close transaction
router.put('/:id/payfine', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue record not found' });
    const { finePaid, remarks } = req.body;
    if (issue.fineAmount > 0 && !finePaid) {
      return res.status(400).json({ message: 'Fine must be paid before completing the return.' });
    }
    issue.finePaid = finePaid || false;
    issue.status = 'returned';
    if (remarks) issue.remarks = remarks;
    await issue.save();
    // Mark book available again
    await Book.findOneAndUpdate({ serialNo: issue.bookSerialNo }, { available: true });
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
