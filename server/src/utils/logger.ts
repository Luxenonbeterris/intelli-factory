// server/src/utils/logger.ts
import 'colors'

type LoggerMethod = (msg: string) => void

const logger: {
  success: LoggerMethod
  warn: LoggerMethod
  error: LoggerMethod
  info: LoggerMethod
} = {
  success: (msg) => console.log(`✅ ${msg}`.green),
  warn: (msg) => console.warn(`⚠️  ${msg}`.yellow),
  error: (msg) => console.error(`❌ ${msg}`.red),
  info: (msg) => console.info(`ℹ️  ${msg}`.cyan),
}

export default logger
