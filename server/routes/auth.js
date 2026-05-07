const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect, authorizeRoles } = require('../middleware/auth')
const sendMail = require('../utils/mailer')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNo, institution, qualification, experience, expertise, bio, linkedIn } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(400).json({ message: 'An account with this email already exists.' })

    const isEducator = role === 'instructor'
    const user = await User.create({
      name, email, password, rollNo: rollNo || '', institution: institution || '',
      role: isEducator ? 'instructor' : 'student',
      educatorStatus: isEducator ? 'pending' : 'none',
      qualification: qualification || '', experience: experience || '',
      expertise: expertise ? expertise.split(',').map(s => s.trim()).filter(Boolean) : [],
      bio: bio || '', linkedIn: linkedIn || '',
    })

    // Send welcome email
    if (isEducator) {
      await sendMail(user.email, '⏳ Educator Application Received — EduAI',
        `Dear ${user.name},\n\nThank you for registering as an educator on EduAI!\n\nYour application is under review (24–48 hours). We'll email you once a decision is made.\n\nWhile you wait, feel free to explore the platform.\n\nEduAI Team`)
    } else {
      await sendMail(user.email, '🎓 Welcome to EduAI!',
        `Dear ${user.name},\n\nWelcome aboard! Your EduAI student account has been created.\n\nYou can now:\n• Browse & enroll in free courses\n• Purchase premium courses\n• Earn XP and badges\n• Get help from the AI Tutor\n\nHappy Learning!\nEduAI Team`)
    }

    const token = generateToken(user._id)
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error during registration.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' })

    if (user.blocked) return res.status(403).json({ message: '🚫 Account permanently blocked. Contact legal@eduai.com.' })

    // Auto-lift suspension if expired
    if (user.suspended && user.suspendedUntil && new Date() >= new Date(user.suspendedUntil)) {
      user.suspended = false
      user.suspendedUntil = undefined
      await user.save()
    }
    if (user.suspended) {
      const until = user.suspendedUntil ? new Date(user.suspendedUntil).toLocaleString('en-IN') : 'unknown'
      return res.status(403).json({ message: `⚠️ Account suspended until ${until}. Contact support@eduai.com.` })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' })

    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' })
  }
})

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, rollNo, bio, qualification, experience, expertise, linkedIn, website } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (name) user.name = name
    if (rollNo !== undefined) user.rollNo = rollNo
    if (bio !== undefined) user.bio = bio
    if (qualification !== undefined) user.qualification = qualification
    if (experience !== undefined) user.experience = experience
    if (expertise !== undefined) user.expertise = typeof expertise === 'string' ? expertise.split(',').map(s => s.trim()).filter(Boolean) : expertise
    if (linkedIn !== undefined) user.linkedIn = linkedIn
    if (website !== undefined) user.website = website
    await user.save()
    res.json({ message: 'Profile updated.', user })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Get all users ──────────────────────────────────────────────────────
router.get('/admin/users', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { role, status } = req.query
    let query = {}
    if (role) query.role = role
    if (status) query.educatorStatus = status
    const users = await User.find(query).sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Approve / reject educator ─────────────────────────────────────────
router.put('/admin/educator/:id/verify', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { action, note } = req.body
    const user = await User.findById(req.params.id)
    if (!user || user.role !== 'instructor') return res.status(404).json({ message: 'Educator not found.' })

    if (action === 'approve') {
      user.educatorStatus = 'approved'
      user.verifiedAt = new Date()
      user.adminNote = ''
      await user.save()
      await sendMail(user.email, '🎉 Educator Account Approved — EduAI',
        `Dear ${user.name},\n\nCongratulations! Your educator application has been approved.\n\nYou can now create and publish courses on EduAI. You earn 80% of every sale.\n\nLog in → Dashboard → "Create Course" to get started.\n\nEduAI Team`)
    } else if (action === 'reject') {
      user.educatorStatus = 'rejected'
      user.adminNote = note || 'Application rejected by admin.'
      await user.save()
      await sendMail(user.email, '📋 Educator Application Update — EduAI',
        `Dear ${user.name},\n\nWe regret to inform you that your educator application could not be approved at this time.\n\nReason: ${user.adminNote}\n\nYou may reapply after 30 days with updated credentials.\n\nEduAI Admin Team`)
    } else {
      return res.status(400).json({ message: 'Invalid action. Use approve or reject.' })
    }
    res.json({ message: `Educator ${action}d successfully.`, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Suspend / unsuspend user ──────────────────────────────────────────
router.put('/admin/user/:id/suspend', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { suspend, reason } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot suspend admin accounts.' })

    if (suspend) {
      const count = (user.suspensionCount || 0) + 1
      const hours = count > 2 ? 168 : 24
      user.suspended = true
      user.suspendedUntil = new Date(Date.now() + hours * 3600000)
      user.suspensionCount = count
      await user.save()
      await sendMail(user.email, '⚠️ Account Suspended — EduAI',
        `Dear ${user.name},\n\nYour account has been suspended for ${count > 2 ? '7 days' : '24 hours'} (violation #${count}).\n\nReason: ${reason || 'Breach of platform guidelines.'}\n\nSuspension ends: ${user.suspendedUntil.toLocaleString('en-IN')}\n\nTo appeal: support@eduai.com\n\nEduAI Trust & Safety`)
    } else {
      user.suspended = false
      user.suspendedUntil = undefined
      await user.save()
      await sendMail(user.email, '✅ Account Reinstated — EduAI',
        `Dear ${user.name},\n\nYour account suspension has been lifted. You may log in again.\n\nPlease follow our community guidelines going forward.\n\nEduAI Team`)
    }
    res.json({ message: `User ${suspend ? 'suspended' : 'unsuspended'}.`, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Block / unblock user ───────────────────────────────────────────────
router.put('/admin/user/:id/block', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { block } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot block admin accounts.' })

    user.blocked = !!block
    await user.save()
    if (block) {
      await sendMail(user.email, '🚫 Account Blocked — EduAI',
        `Dear ${user.name},\n\nYour account has been permanently blocked due to serious violations.\n\nTo appeal: legal@eduai.com\n\nEduAI Trust & Safety`)
    } else {
      await sendMail(user.email, '✅ Account Unblocked — EduAI',
        `Dear ${user.name},\n\nYour account block has been lifted. You may log in again.\n\nEduAI Team`)
    }
    res.json({ message: `User ${block ? 'blocked' : 'unblocked'}.`, user })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Delete user ────────────────────────────────────────────────────────
router.delete('/admin/user/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin accounts.' })
    await sendMail(user.email, '🗑️ Account Removed — EduAI',
      `Dear ${user.name},\n\nYour EduAI account has been permanently removed.\n\nIf you believe this is an error: legal@eduai.com\n\nEduAI Admin`)
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── ADMIN: Get platform stats ─────────────────────────────────────────────────
router.get('/admin/stats', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalInstructors, pendingInstructors] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'instructor', educatorStatus: 'pending' }),
    ])
    res.json({ totalUsers, totalStudents, totalInstructors, pendingInstructors })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

module.exports = router
