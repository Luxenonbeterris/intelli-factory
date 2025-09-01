// server/src/app.ts
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes'
import customerRequestRoutes from './routes/customerRequest.routes'
import locationRoutes from './routes/location.routes'

dotenv.config()

const app = express()

// Build allowlist from env (comma-separated)
const raw = process.env.FRONTEND_ORIGINS ?? ''
const allowlist = raw
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const isDev = process.env.NODE_ENV !== 'production'
const vercelPreviewRe = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i
const ALLOW_VERCEL_PREVIEWS = process.env.ALLOW_VERCEL_PREVIEWS === '1'

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true) // curl/healthchecks
    if (isDev && /^http:\/\/localhost(:\d+)?$/i.test(origin)) return cb(null, true)
    if (allowlist.includes(origin)) return cb(null, true)
    if (ALLOW_VERCEL_PREVIEWS && vercelPreviewRe.test(origin)) return cb(null, true)

    // IMPORTANT: do NOT throw here; just deny
    // This causes the preflight to return 204 without CORS headers
    // and the browser will block the request (expected).
    return cb(null, false)
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

// CORS must be before routes
app.use(cors(corsOptions))
// Explicitly answer preflights
app.options(/.*/, cors(corsOptions))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/customer/requests', customerRequestRoutes)
app.use('/api', locationRoutes)
//app.use('/api/email', emailRoutes)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

export default app
