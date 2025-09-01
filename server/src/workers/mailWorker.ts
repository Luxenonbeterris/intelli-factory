// server/src/workers/mailWorker.ts
import { Worker } from 'bullmq'
import { redis } from '../queues/redis'
import { sendVerificationEmail } from '../services/mailService'

new Worker(
  'mail',
  async (job) => {
    if (job.name === 'sendVerification') {
      const { email, token } = job.data as { email: string; token: string }
      await sendVerificationEmail(email, token)
    }
  },
  { connection: redis }
)

console.log('[worker] mail worker started')
