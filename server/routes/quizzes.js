const express = require('express')
const router = express.Router()
const Quiz = require('../models/Quiz')
const { protect, authorizeRoles } = require('../middleware/auth')

// ── GET /api/quizzes — Get all quizzes ────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { courseId } = req.query
    const filter = { isPublished: true }
    if (courseId) filter.courseId = courseId

    const quizzes = await Quiz.find(filter).select('-questions.options.isCorrect -attempts')
    res.json(quizzes)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── GET /api/quizzes/:id — Get single quiz (without correct answers) ──────────
router.get('/:id', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.options.isCorrect -attempts')
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' })
    res.json(quiz)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── POST /api/quizzes — Create quiz (instructor/admin) ────────────────────────
router.post('/', protect, authorizeRoles('instructor', 'admin'), async (req, res) => {
  try {
    const { title, courseId, questions, passingScore, timeLimit } = req.body
    const quiz = await Quiz.create({ title, courseId, questions, passingScore, timeLimit })
    res.status(201).json(quiz)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── POST /api/quizzes/:id/submit — Submit quiz answers ───────────────────────
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body // array of selected option indices
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' })

    // Calculate score
    let correct = 0
    const results = quiz.questions.map((q, idx) => {
      const selectedIdx = answers[idx]
      const isCorrect = q.options[selectedIdx]?.isCorrect === true
      if (isCorrect) correct++
      return {
        question: q.question,
        selected: selectedIdx,
        correct: q.options.findIndex(o => o.isCorrect),
        isCorrect,
        explanation: q.explanation,
      }
    })

    const score = Math.round((correct / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore

    // Save attempt
    quiz.attempts.push({ userId: req.user._id, score, answers })
    await quiz.save()

    res.json({ score, passed, correct, total: quiz.questions.length, results, passingScore: quiz.passingScore })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── GET /api/quizzes/:id/results — Get user's quiz results ───────────────────
router.get('/:id/results', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' })

    const userAttempts = quiz.attempts.filter(a => a.userId.toString() === req.user._id.toString())
    if (userAttempts.length === 0) return res.status(404).json({ message: 'No attempts found for this quiz.' })

    const best = userAttempts.reduce((a, b) => (a.score > b.score ? a : b))
    res.json({ attempts: userAttempts.length, bestScore: best.score, passed: best.score >= quiz.passingScore })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── DELETE /api/quizzes/:id — Delete quiz ────────────────────────────────────
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id)
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' })
    res.json({ message: 'Quiz deleted successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

module.exports = router
