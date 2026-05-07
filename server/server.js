const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Optional production middleware (gracefully skipped if not installed)
let helmet, rateLimit, compression
try { helmet = require('helmet') } catch (_) { helmet = null }
try { rateLimit = require('express-rate-limit') } catch (_) { rateLimit = null }
try { compression = require('compression') } catch (_) { compression = null }

const app = express()

// ── Security & Performance ────────────────────────────────────────────────────
if (compression) app.use(compression())

if (helmet) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://img.youtube.com"],
        frameSrc: ["https://www.youtube.com"],
        connectSrc: ["'self'", "https://api.x.ai", "https://api.razorpay.com"],
      }
    },
    crossOriginEmbedderPolicy: false,
  }))
}

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (Postman, mobile apps, same-origin)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: ${origin} not allowed`))
  },
  credentials: true,
}))

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))

// ── Rate Limiting ─────────────────────────────────────────────────────────────
if (rateLimit) {
  const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { message: 'Too many requests. Try again later.' } })
  const authLimiter    = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  message: { message: 'Too many auth attempts. Try again in 15 minutes.' } })
  const chatbotLimiter = rateLimit({ windowMs:  1 * 60 * 1000, max: 15,  message: { message: 'AI Tutor rate limit reached. Wait 1 minute.' } })

  app.use('/api/', generalLimiter)
  app.use('/api/auth/login', authLimiter)
  app.use('/api/auth/register', authLimiter)
  app.use('/api/chatbot', chatbotLimiter)
}

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/courses', require('./routes/courses'))
app.use('/api/quizzes', require('./routes/quizzes'))
app.use('/api/chatbot', require('./routes/chatbot'))
app.use('/api/payment', require('./routes/payment'))
app.use('/api/mail',    require('./routes/mail'))

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', version: 'v9.0', ts: new Date().toISOString() }))

// ── Serve React build in production ──────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist')
  app.use(express.static(distPath, { maxAge: '7d', etag: true }))
  // SPA fallback — serve index.html for all non-API routes
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')))
} else {
  app.get('/', (req, res) => res.json({ status: 'EduAI Server Running ✅', version: 'v9.0', env: 'development' }))
  app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }))
}

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500
  console.error('❌', err.message)
  if (process.env.NODE_ENV === 'development') console.error(err.stack)
  res.status(status).json({ message: err.message || 'Internal server error' })
})

// ── DB + Server Boot ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 8000,
})
  .then(() => {
    console.log('✅ MongoDB Connected')
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

module.exports = app
