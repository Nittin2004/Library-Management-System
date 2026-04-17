require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/books',   require('./routes/books'));
app.use('/api/members', require('./routes/members'));
app.use('/api/issues',  require('./routes/issues'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => res.json({ message: 'Library Management API running' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// Vercel serverless functions don't need app.listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
}

// Export the Express API
module.exports = app;
