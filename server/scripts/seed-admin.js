/**
 * seed-admin.js — creates the default admin account
 * Run once after deploying:  node server/scripts/seed-admin.js
 *
 * ⚠️  Change the password immediately after first login!
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@eduai.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME     = process.env.ADMIN_NAME     || 'EduAI Admin'

;(async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB')

  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`)
    process.exit(0)
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    educatorStatus: 'none',
  })

  console.log(`✅ Admin created: ${ADMIN_EMAIL}`)
  console.log('⚠️  IMPORTANT: Change the admin password immediately after first login!')
  process.exit(0)
})().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
