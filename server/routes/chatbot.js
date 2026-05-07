const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')

// ── POST /api/chatbot/ask ─────────────────────────────────────────────────────
// Server-side proxy for Grok (xAI) AI Tutor.
// If GROK_API_KEY is set in .env, requests are proxied here.
// Otherwise the frontend falls back to direct Grok API calls with
// the user's own key stored in their browser.
router.post('/ask', protect, async (req, res) => {
  try {
    const { query, history = [] } = req.body

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query cannot be empty.' })
    }

    if (process.env.GROK_API_KEY) {
      try {
        // Build message history (last 10 turns to keep context window sane)
        const contextMessages = history.slice(-10).map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.text,
        }))
        contextMessages.push({ role: 'user', content: query })

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'grok-3-mini',
            max_tokens: 1000,
            messages: [
              {
                role: 'system',
                content: `You are EduAI, an expert AI tutor for CS students at SRMCEM, Lucknow.
Help with Data Structures & Algorithms, Web Development (MERN), Machine Learning, Operating Systems, and any CS topic.
Be clear, educational, and use **bold** for key terms. Give concise but thorough answers.`,
              },
              ...contextMessages,
            ],
          }),
        })

        const data = await response.json()
        if (data.error) throw new Error(data.error.message)
        const aiResponse = data.choices?.[0]?.message?.content || 'Unable to generate response.'
        return res.json({ response: aiResponse, query, timestamp: new Date().toISOString() })
      } catch (err) {
        console.warn('Grok API error (server-side):', err.message)
      }
    }

    // Fallback — frontend will handle direct Grok call with user's own key
    res.json({
      response: null, // signals frontend to use its own key
      query,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Chatbot error:', err)
    res.status(500).json({ message: 'Server error in chatbot.' })
  }
})

module.exports = router
