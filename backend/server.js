require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Check required environment variables
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Missing environment variable: ${env}`);
  }
});


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
  .then(async () => {
    console.log('✅ MongoDB connected');
    try {
      const adminExists = await User.findOne({ username: 'admin' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const adminPasswordHash = await bcrypt.hash('admin123', salt);
        await User.create({
          username: 'admin',
          name: 'Admin User',
          passwordHash: adminPasswordHash,
          role: 'admin'
        });
        console.log('✅ Demo Admin created');
      }

      const userExists = await User.findOne({ username: 'user' });
      if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        const userPasswordHash = await bcrypt.hash('user123', salt);
        await User.create({
          username: 'user',
          name: 'Demo User',
          passwordHash: userPasswordHash,
          role: 'user'
        });
        console.log('✅ Demo User created');
      }
    } catch (seedErr) {
      console.error('❌ Error creating demo users:', seedErr.message);
    }
  })
  .catch(err => console.error('❌ MongoDB error:', err.message));

// Start server only in development
// Vercel handles the serverless execution by exporting the app
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

if (!isProduction) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}


// Export the Express API
module.exports = app;
