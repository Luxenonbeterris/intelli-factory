// server/src/app.ts
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes'
import customerRequestRoutes from './routes/customerRequest.routes'
import locationRoutes from './routes/location.routes'

dotenv.config()

const app = express()

app.use(cors({ origin: ['http://localhost:5173'], methods: ['GET', 'POST', 'OPTIONS'] }))

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/customer/requests', customerRequestRoutes)
app.use('/api', locationRoutes)

export default app
