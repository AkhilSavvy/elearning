const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    rollNo: { type: String, trim: true, default: '' },
    institution: { type: String, default: '' },

    // Educator fields
    educatorStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
    qualification: { type: String, default: '' },
    experience: { type: String, default: '' },
    expertise: [{ type: String }],
    bio: { type: String, default: '' },
    linkedIn: { type: String, default: '' },
    website: { type: String, default: '' },
    adminNote: { type: String, default: '' },
    verifiedAt: { type: Date, default: null },

    // Subscription
    subscription: {
      plan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      razorpaySubId: { type: String, default: '' },
      status: { type: String, enum: ['active', 'expired', 'cancelled', 'none'], default: 'none' },
    },

    // Courses
    enrolledCourses: [{
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      enrolledAt: { type: Date, default: Date.now },
      paidAmount: { type: Number, default: 0 },
    }],
    progress: { type: Map, of: [String], default: {} },
    quizScores: [{ quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, score: Number, attemptedAt: { type: Date, default: Date.now } }],

    // Wallet
    walletBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },

    // Gamification
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastStudyDate: { type: String, default: null },
    badges: [{ type: String }],

    lastLogin: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})
userSchema.methods.matchPassword = async function (pw) { return await bcrypt.compare(pw, this.password) }
userSchema.methods.toJSON = function () { const obj = this.toObject(); delete obj.password; return obj }

module.exports = mongoose.model('User', userSchema)
