const express = require('express')
const router = express.Router()
const Course = require('../models/Course')
const User = require('../models/User')
const { protect, authorizeRoles } = require('../middleware/auth')

// GET /api/courses — public approved courses
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find({ approvalStatus: 'approved', isPublished: true })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// GET /api/courses/my — educator's own courses
router.get('/my', protect, authorizeRoles('instructor', 'admin'), async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user._id }).sort({ createdAt: -1 })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// GET /api/courses/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/courses — create course (approved educators only)
router.post('/', protect, authorizeRoles('instructor', 'admin'), async (req, res) => {
  try {
    // Educators must be approved before creating
    if (req.user.role === 'instructor' && req.user.educatorStatus !== 'approved') {
      return res.status(403).json({ message: 'Your educator account must be approved before creating courses.' })
    }
    const { title, shortDesc, description, category, level, language, icon, color, price, isFree, contentModel, xpPerVideo, tags, videos } = req.body
    const course = await Course.create({
      title, shortDesc, description, instructor: req.user.name,
      instructorId: req.user._id, category, level, language, icon, color,
      price: price || 0, isFree: isFree !== false,
      contentModel: contentModel || (price > 0 ? 'paid' : 'free'),
      xpPerVideo: xpPerVideo || 25, tags: tags || [],
      videos: videos || [], approvalStatus: 'pending', isPublished: false,
    })
    res.status(201).json(course)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// PUT /api/courses/:id — update
router.put('/:id', protect, authorizeRoles('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    if (req.user.role === 'instructor' && String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized.' })
    }
    Object.assign(course, req.body)
    await course.save()
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// DELETE /api/courses/:id
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    res.json({ message: 'Course deleted successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/courses/:id/enroll — free enrollment
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    if (course.price > 0 && course.contentModel === 'paid') {
      return res.status(400).json({ message: 'This is a paid course. Please purchase it.' })
    }
    const already = req.user.enrolledCourses?.some(e => String(e.courseId) === String(course._id))
    if (already) return res.status(400).json({ message: 'Already enrolled.' })

    await User.findByIdAndUpdate(req.user._id, { $push: { enrolledCourses: { courseId: course._id, paidAmount: 0 } } })
    course.enrolledStudents.push(req.user._id)
    course.totalEnrollments = (course.totalEnrollments || 0) + 1
    await course.save()
    res.json({ message: 'Enrolled successfully.', courseId: course._id })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/courses/:id/purchase — paid course purchase (Razorpay)
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    const { razorpayPaymentId, razorpayOrderId } = req.body

    // In production: verify Razorpay signature here
    // const crypto = require('crypto')
    // const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex')

    const educatorEarning = course.price * 0.8
    const platformFee = course.price * 0.2

    await User.findByIdAndUpdate(req.user._id, { $push: { enrolledCourses: { courseId: course._id, paidAmount: course.price } } })
    await User.findByIdAndUpdate(course.instructorId, { $inc: { walletBalance: educatorEarning, totalEarnings: educatorEarning } })

    course.enrolledStudents.push(req.user._id)
    course.totalEnrollments = (course.totalEnrollments || 0) + 1
    await course.save()

    // Save transaction
    const Transaction = require('../models/Transaction')
    await Transaction.create({
      studentId: req.user._id, educatorId: course.instructorId,
      courseId: course._id, courseTitle: course.title,
      amount: course.price, educatorEarning, platformFee,
      razorpayPaymentId: razorpayPaymentId || 'demo',
      status: 'completed',
    })

    res.json({ message: 'Purchase successful.', courseId: course._id })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/courses/:id/videos — add video (educator)
router.post('/:id/videos', protect, authorizeRoles('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    if (req.user.role === 'instructor' && String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized.' })
    }
    const { id, title, duration, thumb, url, isFree, isSubscription } = req.body
    course.videos.push({ id: id || `v${course.videos.length + 1}`, title, duration, thumb, url, isFree: isFree || false, isSubscription: isSubscription || false })
    await course.save()
    res.status(201).json({ message: 'Video added.', videos: course.videos })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/courses/:id/resources — add resource (educator)
router.post('/:id/resources', protect, authorizeRoles('instructor', 'admin'), async (req, res) => {
  try {
    const { name, type, url, isFree } = req.body
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })
    course.resources.push({ name, type, url, isFree: isFree || false })
    await course.save()
    res.status(201).json({ message: 'Resource added.', resources: course.resources })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Get pending courses ────────────────────────────────────────────────
router.get('/admin/pending', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const courses = await Course.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Approve / reject course ───────────────────────────────────────────
router.put('/admin/:id/review', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { action, note } = req.body
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'Course not found.' })

    if (action === 'approve') {
      course.approvalStatus = 'approved'
      course.isPublished = true
      course.approvedAt = new Date()
      course.approvedBy = req.user._id
      course.adminNote = ''
    } else if (action === 'reject') {
      course.approvalStatus = 'rejected'
      course.isPublished = false
      course.adminNote = note || 'Rejected by admin.'
    } else {
      return res.status(400).json({ message: 'Invalid action.' })
    }
    await course.save()
    res.json({ message: `Course ${action}d.`, course })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

module.exports = router
