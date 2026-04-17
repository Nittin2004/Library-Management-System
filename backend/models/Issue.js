const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  bookSerialNo: { type: String, required: true },
  bookTitle: { type: String, required: true },
  authorName: { type: String, required: true },
  membershipNo: { type: String },
  borrowerName: { type: String },
  issueDate: { type: Date, required: true },
  scheduledReturn: { type: Date, required: true },
  actualReturn: { type: Date },
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String },
  status: { type: String, enum: ['issued', 'returned'], default: 'issued' },
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
