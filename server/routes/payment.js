const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const { protect } = require('../middleware/auth')
const User = require('../models/User')
const Transaction = require('../models/Transaction')

// ── POST /api/payment/create-order — Razorpay order ──────────────────────────
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, courseId, courseTitle } = req.body
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount.' })

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
        !process.env.RAZORPAY_KEY_ID.includes('xxxx')) {
      // Real Razorpay order
      const Razorpay = require('razorpay')
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `receipt_${courseId || 'sub'}_${Date.now()}`,
        notes: { courseId: courseId || '', courseTitle: courseTitle || '' },
      })
      return res.json({ order, key: process.env.RAZORPAY_KEY_ID })
    }

    // Demo/test mode
    const order = {
      id: 'order_demo_' + Date.now(),
      amount: Math.round(amount * 100),
      currency: 'INR',
      courseId,
      courseTitle,
    }
    res.json({ order, key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo' })
  } catch (err) {
    console.error('Create order error:', err)
    res.status(500).json({ message: 'Order creation failed.' })
  }
})

// ── POST /api/payment/verify — verify Razorpay payment ───────────────────────
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, courseId, amount } = req.body

    // Real signature verification
    if (process.env.RAZORPAY_KEY_SECRET && !process.env.RAZORPAY_KEY_SECRET.includes('xxxx')) {
      const body = razorpayOrderId + '|' + razorpayPaymentId
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex')
      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Payment verification failed: invalid signature.' })
      }
    }

    // Record transaction
    if (courseId && amount) {
      await Transaction.create({
        studentId: req.user._id,
        courseId,
        amount: Number(amount),
        currency: 'INR',
        educatorEarning: Math.round(Number(amount) * 0.8),
        platformFee: Math.round(Number(amount) * 0.2),
        razorpayPaymentId,
        status: 'completed',
        type: 'course',
      })
    }

    res.json({ success: true, message: 'Payment verified.' })
  } catch (err) {
    console.error('Verify error:', err)
    res.status(500).json({ message: 'Verification failed.' })
  }
})

// ── POST /api/payment/subscribe ───────────────────────────────────────────────
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { plan, razorpayPaymentId } = req.body
    const planDurations = { pro: 30, premium: 365 }
    const planPrices    = { pro: 299, premium: 1999 }

    if (!planDurations[plan]) return res.status(400).json({ message: 'Invalid plan.' })

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + planDurations[plan])

    await User.findByIdAndUpdate(req.user._id, {
      subscription: {
        plan,
        startDate: new Date(),
        endDate,
        razorpaySubId: razorpayPaymentId || 'demo_sub_' + Date.now(),
        status: 'active',
      },
    })

    await Transaction.create({
      studentId: req.user._id,
      courseTitle: `${plan.toUpperCase()} Subscription`,
      amount: planPrices[plan],
      currency: 'INR',
      educatorEarning: 0,
      platformFee: planPrices[plan],
      razorpayPaymentId: razorpayPaymentId || 'demo',
      status: 'completed',
      type: 'subscription',
    })

    res.json({ message: 'Subscription activated.', plan, endDate })
  } catch (err) {
    res.status(500).json({ message: 'Subscription failed.' })
  }
})

// ── GET /api/payment/transactions ─────────────────────────────────────────────
router.get('/transactions', protect, async (req, res) => {
  try {
    const txns = await Transaction.find({ studentId: req.user._id }).sort({ createdAt: -1 })
    res.json(txns)
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── GET /api/payment/educator-earnings ───────────────────────────────────────
router.get('/educator-earnings', protect, async (req, res) => {
  try {
    const txns = await Transaction.find({
      educatorId: req.user._id,
      type: { $ne: 'subscription' },
    }).sort({ createdAt: -1 })
    const total = txns.reduce((s, t) => s + (t.educatorEarning || 0), 0)
    res.json({ transactions: txns, totalEarnings: total })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// ── POST /api/payment/withdraw ────────────────────────────────────────────────
router.post('/withdraw', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user.walletBalance || user.walletBalance <= 0) {
      return res.status(400).json({ message: 'No balance to withdraw.' })
    }
    const amount = user.walletBalance
    user.walletBalance = 0
    await user.save()
    res.json({ message: `Withdrawal of ₹${amount} initiated. Will be credited in 2–3 business days.`, amount })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

module.exports = router
