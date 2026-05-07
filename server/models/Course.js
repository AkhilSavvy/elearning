const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '10:00' },
  thumb: { type: String, default: '🎬' },
  url: { type: String, default: '' },
  isFree: { type: Boolean, default: false },      // free preview
  isSubscription: { type: Boolean, default: false }, // subscription-only
  uploadedAt: { type: Date, default: Date.now },
})

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'video', 'notes', 'link'], default: 'pdf' },
  url: { type: String, default: '' },
  isFree: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
})

const reviewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now },
})

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDesc: { type: String, default: '' },
    description: { type: String, default: '' },
    instructor: { type: String, required: true, trim: true },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    category: { type: String, default: 'General' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    language: { type: String, default: 'English' },
    icon: { type: String, default: '📚' },
    color: { type: String, default: '#6366f1' },
    tags: [{ type: String }],

    // Pricing model
    price: { type: Number, default: 0 },       // 0 = fully free
    isFree: { type: Boolean, default: true },
    contentModel: {
      type: String,
      enum: ['free', 'paid', 'subscription', 'freemium'],
      default: 'free',
      // free = all content free
      // paid = one-time purchase
      // subscription = need active subscription
      // freemium = mix of free previews + paid
    },
    xpPerVideo: { type: Number, default: 25 },

    // Status
    isPublished: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote: { type: String, default: '' },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    videos: [videoSchema],
    resources: [resourceSchema],
    reviews: [reviewSchema],

    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalEnrollments: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Course', courseSchema)
