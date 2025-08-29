// server/src/app.ts
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes'
import customerRequestRoutes from './routes/customerRequest.routes'
import locationRoutes from './routes/location.routes'

dotenv.config()

const app = express()

// Build allowlist from env
const raw = process.env.FRONTEND_ORIGINS ?? process.env.CLIENT_ORIGIN ?? ''
const allowedOrigins = raw
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools / health checks with no Origin
      if (!origin) return cb(null, true)
      if (allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`Not allowed by CORS: ${origin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/customer/requests', customerRequestRoutes)
app.use('/api', locationRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

export default app
