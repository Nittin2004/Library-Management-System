const router = require('express').Router();
const Member = require('../models/Member');
const auth = require('../middleware/auth');

function calcExpiry(start, type) {
  const d = new Date(start);
  if (type === '6months') d.setMonth(d.getMonth() + 6);
  else if (type === '1year') d.setFullYear(d.getFullYear() + 1);
  else if (type === '2years') d.setFullYear(d.getFullYear() + 2);
  return d;
}

// GET /api/members
router.get('/', auth, async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/members/:membershipNo
router.get('/:membershipNo', auth, async (req, res) => {
  try {
    const member = await Member.findOne({ membershipNo: req.params.membershipNo });
    if (!member) return res.status(404).json({ message: 'Membership not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/members — admin only
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const { membershipNo, name, email, phone, address, membershipType } = req.body;
    const startDate = new Date();
    const expiryDate = calcExpiry(startDate, membershipType || '6months');
    const member = new Member({ membershipNo, name, email, phone, address, membershipType: membershipType || '6months', startDate, expiryDate });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Membership number already exists' });
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/members/:membershipNo — extend or cancel
router.put('/:membershipNo', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const member = await Member.findOne({ membershipNo: req.params.membershipNo });
    if (!member) return res.status(404).json({ message: 'Membership not found' });
    const { action, membershipType } = req.body;
    if (action === 'cancel') {
      member.status = 'cancelled';
    } else {
      // extend from current expiry or today (whichever is later)
      const base = member.expiryDate > new Date() ? member.expiryDate : new Date();
      member.expiryDate = calcExpiry(base, membershipType || '6months');
      member.membershipType = membershipType || member.membershipType;
      member.status = 'active';
    }
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
