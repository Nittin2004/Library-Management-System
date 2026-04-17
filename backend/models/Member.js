const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  membershipNo: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  membershipType: { type: String, enum: ['6months', '1year', '2years'], default: '6months' },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
