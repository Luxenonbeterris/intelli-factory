// server/src/app.ts
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes'
import customerRequestRoutes from './routes/customerRequest.routes'
import locationRoutes from './routes/location.routes'

dotenv.config()

const app = express()

const origin = process.env.CLIENT_ORIGIN || '*'
app.use(
  cors({
    origin,
    methods: ['GET', 'POST', 'OPTIONS'],
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
