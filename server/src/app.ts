import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes'
import customerRequestRoutes from './routes/customerRequest.routes'

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/customer/requests', customerRequestRoutes)

export default app
