// server/src/utils/audit-safe.ts
// utils/audit-safe.ts
import type { PrismaClient } from '@prisma/client'
import type { Request } from 'express'
import { audit, type AuditInput } from './audit'
import logger from './logger'

const AUDIT_TIMEOUT_MS = Number(process.env.AUDIT_TIMEOUT_MS ?? '0')

function withTimeout<T>(p: Promise<T>, ms: number) {
  return Promise.race([
    p,
    new Promise<never>((_, rej) => setTimeout(() => rej(new Error(`audit timeout ${ms}ms`)), ms)),
  ])
}

// Fire-and-forget; never throws, never blocks the request path
export function auditSafe(prisma: PrismaClient, req: Request | null, entry: AuditInput) {
  const p = audit(prisma, req, entry)
  const run = AUDIT_TIMEOUT_MS > 0 ? withTimeout(p, AUDIT_TIMEOUT_MS) : p

  void run.catch((err) => {
    logger.warn({ message: 'audit write failed', error: String(err), entry })
  })
}
