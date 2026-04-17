const router = require('express').Router();
const Issue = require('../models/Issue');
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// GET /api/reports/issued — all currently issued books
router.get('/issued', auth, async (req, res) => {
  try {
    const issued = await Issue.find({ status: 'issued' }).sort({ issueDate: -1 });
    res.json(issued);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/overdue — books past their scheduled return date
router.get('/overdue', auth, async (req, res) => {
  try {
    const overdue = await Issue.find({ status: 'issued', scheduledReturn: { $lt: new Date() } }).sort({ scheduledReturn: 1 });
    res.json(overdue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/members — all members
router.get('/members', auth, async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
