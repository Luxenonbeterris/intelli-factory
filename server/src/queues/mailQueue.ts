// server/src/queues/mailQueue.ts
import { Queue } from 'bullmq'
import { redis } from './redis'
export const mailQueue = new Queue('mail', { connection: redis })
