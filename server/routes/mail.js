const express = require('express')
const router  = express.Router()
const sendMail = require('../utils/mailer')

/**
 * POST /api/mail/send
 * Body: { to, subject, body, html? }
 *
 * Called by the React frontend whenever it needs to dispatch
 * a notification email (enrollment, admin actions, etc.).
 * Authentication is intentionally relaxed here — all calls
 * come from the same origin and SMTP credentials live
 * server-side only, never exposed to the client.
 */
router.post('/send', async (req, res) => {
  try {
    const { to, subject, body, html } = req.body
    if (!to || !subject || !body) {
      return res.status(400).json({ message: 'to, subject, and body are required.' })
    }
    await sendMail(to, subject, body, html || undefined)
    res.json({ ok: true })
  } catch (err) {
    console.error('[mail/send]', err.message)
    res.status(500).json({ message: 'Failed to send email.' })
  }
})

module.exports = router
