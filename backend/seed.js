require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Member = require('./models/Member');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  // Seed Users
  const existing = await User.findOne({ username: 'admin' });
  if (!existing) {
    await User.insertMany([
      { username: 'admin', passwordHash: await bcrypt.hash('admin123', 10), role: 'admin', name: 'Admin User' },
      { username: 'user',  passwordHash: await bcrypt.hash('user123', 10),  role: 'user',  name: 'Library User' },
    ]);
    console.log('✅ Users seeded');
  } else {
    console.log('ℹ️  Users already exist, skipping');
  }

  // Seed sample books
  const bookCount = await Book.countDocuments();
  if (bookCount === 0) {
    await Book.insertMany([
      { serialNo: 'B001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', mediaType: 'book', available: true },
      { serialNo: 'B002', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', mediaType: 'book', available: true },
      { serialNo: 'B003', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', mediaType: 'book', available: true },
      { serialNo: 'B004', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', mediaType: 'book', available: true },
      { serialNo: 'B005', title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', mediaType: 'book', available: true },
      { serialNo: 'M001', title: 'Inception', author: 'Christopher Nolan', category: 'Sci-Fi', mediaType: 'movie', available: true },
    ]);
    console.log('✅ Books seeded');
  } else {
    console.log('ℹ️  Books already exist, skipping');
  }

  // Seed sample member
  const memberCount = await Member.countDocuments();
  if (memberCount === 0) {
    const start = new Date();
    const expiry = new Date(); expiry.setMonth(expiry.getMonth() + 6);
    await Member.create({
      membershipNo: 'MEM001', name: 'John Doe', email: 'john@example.com',
      phone: '9876543210', address: '123 Main St', membershipType: '6months',
      startDate: start, expiryDate: expiry, status: 'active'
    });
    console.log('✅ Member seeded');
  }

  console.log('🌱 Seeding complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
