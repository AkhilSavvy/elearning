const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  educatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  courseTitle: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'completed', 'refunded', 'failed'], default: 'completed' },
  type: { type: String, enum: ['course_purchase', 'subscription', 'withdrawal'], default: 'course_purchase' },
  razorpayPaymentId: { type: String, default: '' },
  transactionId: { type: String, default: () => 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase() },
  educatorEarning: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)
