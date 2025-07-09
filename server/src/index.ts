import dotenv from 'dotenv'
import app from './app'
import logger from './utils/logger'

dotenv.config()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  logger.success(`API running on http://localhost:${PORT}`)
})
