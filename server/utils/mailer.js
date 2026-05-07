/**
 * EduAI Mailer — Nodemailer SMTP
 * ─────────────────────────────────────────────────────────────────────────────
 * Setup:
 *   1. npm install nodemailer  (already in package.json)
 *   2. In server/.env set:
 *        SMTP_HOST=smtp.gmail.com
 *        SMTP_PORT=587
 *        SMTP_SECURE=false
 *        SMTP_USER=your@gmail.com
 *        SMTP_PASS=your-app-password     ← from myaccount.google.com/apppasswords
 *        EMAIL_FROM=EduAI <no-reply@eduai.com>
 *
 * Usage in any route:
 *   const sendMail = require('../utils/mailer')
 *   await sendMail('student@example.com', 'Welcome!', 'Your account is ready.')
 *
 * If SMTP is not configured the function logs to console (silent fallback).
 */

const nodemailer = require('nodemailer')

let transporter = null

const getTransporter = () => {
  if (transporter) return transporter
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  })
  return transporter
}

/**
 * Send an email.
 * @param {string}  to      Recipient address
 * @param {string}  subject Subject line
 * @param {string}  text    Plain-text body
 * @param {string}  [html]  Optional HTML body (overrides text in capable clients)
 * @returns {Promise<void>}
 */
const sendMail = async (to, subject, text, html) => {
  if (!to || !to.includes('@')) return
  const t = getTransporter()
  if (!t) {
    // SMTP not configured — just log
    console.log(`[MAILER] (no SMTP) To: ${to} | Subject: ${subject}`)
    return
  }
  try {
    const info = await t.sendMail({
      from:    process.env.EMAIL_FROM || 'EduAI <no-reply@eduai.com>',
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>'),
    })
    console.log(`[MAILER] ✅ Sent to ${to} — messageId: ${info.messageId}`)
  } catch (err) {
    console.error(`[MAILER] ❌ Failed to send to ${to}:`, err.message)
    // Never throw — email failure must not crash the API
  }
}

module.exports = sendMail
