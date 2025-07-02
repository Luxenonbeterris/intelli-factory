import 'colors'

const logger = {
  success: (msg) => console.log(`✅ ${msg}`.green),
  warn: (msg) => console.warn(`⚠️  ${msg}`.yellow),
  error: (msg) => console.error(`❌ ${msg}`.red),
  info: (msg) => console.info(`ℹ️  ${msg}`.cyan),
}

export default logger
