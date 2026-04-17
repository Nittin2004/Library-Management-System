const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET /api/users — admin only
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const users = await User.find({}, '-passwordHash').sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:username
router.get('/:username', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const user = await User.findOne({ username: req.params.username }, '-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users — create new user (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const { username, password, role, name } = req.body;
    if (!username || !password || !name) return res.status(400).json({ message: 'Username, password and name are required' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash, role: role || 'user', name });
    await user.save();
    res.status(201).json({ username: user.username, role: user.role, name: user.name });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Username already exists' });
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/users/:username — update name, role, or password (admin only)
router.put('/:username', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.role) updates.role = req.body.role;
    if (req.body.password) updates.passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate({ username: req.params.username }, updates, { new: true, select: '-passwordHash' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
