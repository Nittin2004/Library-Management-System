const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid username or password' });
    if (role && user.role !== role) return res.status(403).json({ message: `This account does not have "${role}" access` });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { username: user.username, role: user.role, name: user.name } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    });
  }
});


module.exports = router;
