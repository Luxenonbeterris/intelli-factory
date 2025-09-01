// server/src/queues/redis.ts
import IORedis from 'ioredis'

export const redis = new IORedis(process.env.REDIS_URL!, {
  // Required for BullMQ to avoid throwing:
  // "BullMQ: Your redis options maxRetriesPerRequest must be null."
  maxRetriesPerRequest: null,

  // Often recommended for serverless/managed Redis (Upstash, etc.)
  enableReadyCheck: false,

  // Optional: better behavior on intermittent networks
  // reconnectOnError: () => true,
  // keepAlive: 1,
})
