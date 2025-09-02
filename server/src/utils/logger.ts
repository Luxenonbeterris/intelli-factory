// server/src/utils/logger.ts
import 'colors'

type LogInput = string | unknown
const fmt = (x: LogInput) =>
  typeof x === 'string'
    ? x
    : (() => {
        try {
          return JSON.stringify(x, null, 2)
        } catch {
          return String(x)
        }
      })()

const logger = {
  success: (msg: LogInput) => console.log(`✅ ${fmt(msg)}`.green),
  warn: (msg: LogInput) => console.warn(`⚠️  ${fmt(msg)}`.yellow),
  error: (msg: LogInput) => console.error(`❌ ${fmt(msg)}`.red),
  info: (msg: LogInput) => console.info(`ℹ️  ${fmt(msg)}`.cyan),
}
export default logger
