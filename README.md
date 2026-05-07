# EduAI Platform — v9.0

Full-stack AI-powered e-learning platform for SRMCEM, Lucknow.
**React 18 + Node.js + Express + MongoDB + Razorpay + Grok AI Tutor**

---

## ✅ What's New in v9.0

| Area | Change |
|---|---|
| 🔒 Security | Helmet CSP headers, express-rate-limit (auth: 20/15m, AI: 15/1m) |
| 🚀 Production | Server serves built React app — single-service deployment |
| 💳 Payments | Real Razorpay HMAC-SHA256 signature verification |
| 🌐 CORS | Env-driven `CLIENT_URL` — no hardcoded URLs |
| 📦 Build | `npm run build` → Vite bundles React into `client/dist/` |
| ⚙️ Deployment | `Procfile` (Heroku/Railway) + `render.yaml` (Render.com) included |

---

## 🔧 Local Development

```bash
# 1. Clone & install all dependencies
git clone <your-repo>
cd elearning-platform
npm run install:all

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI and JWT_SECRET at minimum

# 3. Start dev servers (hot-reload on both)
npm run dev
# Client → http://localhost:5173
# Server → http://localhost:5000
```

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@eduai.com | admin123 |
| Student | Register via UI | — |
| Educator | Register via UI | needs admin approval |

---

## 🚀 Production Deployment

### Option A — Render.com (Recommended, Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service → connect repo
3. Render auto-detects `render.yaml` — click **Deploy**
4. Set environment variables in the Render dashboard (marked `sync: false` in render.yaml)

### Option B — Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
# Set env vars in Railway dashboard
```

### Option C — Heroku

```bash
heroku create your-app-name
heroku config:set NODE_ENV=production MONGO_URI=... JWT_SECRET=...
git push heroku main
```

### Option D — Self-hosted VPS (Ubuntu/Debian)

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Deploy
cd /var/www/elearning-platform
npm run install:all
npm run build
NODE_ENV=production pm2 start server/server.js --name eduai
pm2 save && pm2 startup

# Nginx reverse proxy (optional but recommended)
# proxy_pass http://127.0.0.1:5000;
```

---

## 🌍 Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | ✅ | `production` or `development` |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Random 64-char secret (see below) |
| `CLIENT_URL` | ✅ | Deployed frontend URL for CORS |
| `RAZORPAY_KEY_ID` | Payments | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Payments | Razorpay secret |
| `SMTP_HOST` | Email | SMTP host (e.g. smtp.gmail.com) |
| `SMTP_USER` / `SMTP_PASS` | Email | SMTP credentials |
| `GROK_API_KEY` | AI Tutor | xAI Grok API key (free tier available) |

**Generate a strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🏗 Project Structure

```
elearning-platform/
├── client/                # React 18 + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main app (single-file architecture)
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global resets
│   ├── index.html
│   └── vite.config.js
│
├── server/                # Express + MongoDB backend
│   ├── routes/
│   │   ├── auth.js        # Register, login, profile, admin user mgmt
│   │   ├── courses.js     # Course CRUD + admin approval
│   │   ├── quizzes.js     # Quiz engine
│   │   ├── chatbot.js     # Grok AI proxy
│   │   ├── payment.js     # Razorpay orders + verification
│   │   └── mail.js        # Nodemailer SMTP
│   ├── models/            # Mongoose schemas
│   ├── middleware/
│   │   └── auth.js        # JWT protect + role-based access
│   ├── utils/
│   │   └── mailer.js      # Reusable email helper
│   ├── server.js          # Main entry — serves API + React build
│   └── .env.example
│
├── Procfile               # Heroku / Railway deployment
├── render.yaml            # Render.com deployment config
├── .gitignore
└── package.json           # Root scripts
```

---

## 🔒 Security Notes

- JWT tokens expire in 7 days
- Auth endpoints rate-limited: 20 requests / 15 min
- AI Tutor rate-limited: 15 requests / 1 min
- All API routes protected with `protect` middleware
- Helmet sets security headers (CSP, HSTS, X-Frame-Options etc.)
- Razorpay payments verified with HMAC-SHA256 signature
- Passwords hashed with bcrypt (10 rounds)
- `admin@eduai.com` — **change the admin password immediately after first login in production**

---

## 📧 Email Setup

Gmail (recommended for testing):
1. Enable 2-Factor Authentication on your Google account
2. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an App Password for "Mail"
4. Use it as `SMTP_PASS` in your `.env`

---

## 💳 Razorpay Setup

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys → Generate Test Key
3. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`
4. Test with Razorpay test card: `4111 1111 1111 1111` (any future expiry, any CVV)

---

## 🤖 AI Tutor (Grok)

1. Sign up at [https://console.x.ai](https://console.x.ai)
2. Generate a free API key
3. Set `GROK_API_KEY` in `.env`

If `GROK_API_KEY` is not set, students can enter their own key in the AI Tutor UI.

