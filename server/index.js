import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import logger from './utils/logger.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express server!' })
})

app.use((err, req, res) => {
  logger.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  logger.success(`Server running on http://localhost:${PORT}`)
})
