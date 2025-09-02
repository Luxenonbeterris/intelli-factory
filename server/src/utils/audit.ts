// server/src/utils/audit.ts
import type { ActorType, AuditAction, Prisma, PrismaClient } from '@prisma/client'
import type { Request } from 'express'

/** Local widening so we don't depend on global augmentation */
type ReqX = Request & {
  auth?: { userId: number }
  id?: string
}

/** Input JSON type = safe for Prisma Json column */
export type AuditInput = {
  action: AuditAction
  userId?: number | null
  actorId?: number | null
  actorType?: ActorType
  targetType?: string
  targetId?: string
  ip?: string
  userAgent?: string
  requestId?: string
  metadata?: Prisma.InputJsonValue
}

function ipFrom(req: ReqX | null) {
  if (!req) return undefined
  // Prefer Express helpers; avoids Headers typing issues
  const fwd = req.get?.('x-forwarded-for')
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0]!.trim()
  return req.ip || undefined
}

export async function audit(prisma: PrismaClient, req: Request | null, entry: AuditInput) {
  const r = req as ReqX | null

  const derivedActorId = entry.actorId ?? r?.auth?.userId ?? null
  const actorType: ActorType = derivedActorId ? 'USER' : (entry.actorType ?? 'SYSTEM')

  const ip = entry.ip ?? ipFrom(r)
  const userAgent = entry.userAgent ?? (r?.get?.('user-agent') as string | undefined)
  const requestId = entry.requestId ?? r?.id

  await prisma.auditLog.create({
    data: {
      action: entry.action,
      actorType,
      targetType: entry.targetType,
      targetId: entry.targetId,
      ip,
      userAgent,
      requestId,
      metadata: entry.metadata,
      user: entry.userId ? { connect: { id: entry.userId } } : undefined,
      actor: derivedActorId ? { connect: { id: derivedActorId } } : undefined,
    },
  })
}
