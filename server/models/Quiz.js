const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
})

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  explanation: { type: String, default: '' },
})

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      default: 70, // percentage
    },
    timeLimit: {
      type: Number,
      default: 30, // minutes
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    attempts: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: Number,
        answers: [Number],
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Quiz', quizSchema)
