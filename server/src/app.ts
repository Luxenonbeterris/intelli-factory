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

// Optional: allow any vercel preview like https://...vercel.app
const ALLOW_VERCEL_PREVIEWS = process.env.ALLOW_VERCEL_PREVIEWS === '1'
const vercelPreviewRe = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true) // curl/healthchecks
    if (allowlist.includes(origin)) return cb(null, true)
    if (ALLOW_VERCEL_PREVIEWS && vercelPreviewRe.test(origin)) return cb(null, true)
    return cb(new Error(`Not allowed by CORS: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/customer/requests', customerRequestRoutes)
app.use('/api', locationRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

export default app
