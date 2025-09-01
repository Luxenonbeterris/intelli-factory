// server/src/index.ts
import 'dotenv/config'

import app from './app'
import logger from './utils/logger'

import './workers/mailWorker'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  logger.success(`API running on http://localhost:${PORT}`)
})

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err)
})
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err)
})
