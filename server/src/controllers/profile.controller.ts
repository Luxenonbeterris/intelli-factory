// server/src/controllers/profile.controller.ts
import type { Prisma } from '@prisma/client'
import type { Request, Response } from 'express'
import prisma from '../prisma'
import { UpdateMeSchema } from '../schemas/profile.schema'
import { auditSafe } from '../utils/audit-safe'

type AuthedReq = Request & { user?: { id: number } } // <— matches your middleware

function getUserId(req: Request): number | undefined {
  return (req as AuthedReq).user?.id
}

// GET /me
export async function getMe(req: Request, res: Response) {
  const userId = getUserId(req)
  if (!userId) return void res.status(401).json({ error: 'Unauthorized' })

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      countryId: true,
      regionId: true,
      street: true,
      postalCode: true,
    },
  })
  if (!me) return void res.status(404).json({ error: 'User not found' })

  res.json({ user: me })

  auditSafe(prisma, req, {
    action: 'PROFILE_VIEW',
    userId,
    targetType: 'User',
    targetId: String(userId),
  })
}

// PATCH /me
export async function updateMe(req: Request, res: Response) {
  const userId = getUserId(req)
  if (!userId) return void res.status(401).json({ error: 'Unauthorized' })

  const parsed = UpdateMeSchema.safeParse(req.body)
  if (!parsed.success) {
    return void res.status(400).json({ error: 'Invalid input', details: parsed.error.format() })
  }
  const { name, countryId, regionId, street, postalCode } = parsed.data

  const before = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      countryId: true,
      regionId: true,
      street: true,
      postalCode: true,
    },
  })
  if (!before) return void res.status(404).json({ error: 'User not found' })

  const nextCountryId = countryId ?? before.countryId ?? null
  if (regionId != null) {
    if (!nextCountryId) {
      return void res.status(400).json({
        error: 'Invalid input',
        details: { regionId: { _errors: ['countryId is required when regionId is provided'] } },
      })
    }
    const valid = await prisma.region.findFirst({
      where: { id: regionId, countryId: nextCountryId },
      select: { id: true },
    })
    if (!valid) {
      return void res.status(400).json({
        error: 'Invalid input',
        details: { regionId: { _errors: ['regionId does not belong to the selected country'] } },
      })
    }
  }

  const data: Record<string, unknown> = {}
  if (name !== undefined) data.name = name
  if (countryId !== undefined) data.countryId = countryId
  if (regionId !== undefined) data.regionId = regionId
  if (street !== undefined) data.street = street
  if (postalCode !== undefined) data.postalCode = postalCode

  const after = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      countryId: true,
      regionId: true,
      street: true,
      postalCode: true,
    },
  })

  res.json({ user: after })

  // JSON-safe diff
  const changes: Record<string, Prisma.InputJsonValue> = {}
  const setChange = (
    key: 'name' | 'countryId' | 'regionId' | 'street' | 'postalCode',
    b: unknown,
    a: unknown
  ) => {
    if (b !== a) {
      changes[key] = {
        before: (b ?? null) as Prisma.InputJsonValue,
        after: (a ?? null) as Prisma.InputJsonValue,
      }
    }
  }
  setChange('name', before.name, after.name)
  setChange('countryId', before.countryId, after.countryId)
  setChange('regionId', before.regionId, after.regionId)
  setChange('street', before.street, after.street)
  setChange('postalCode', before.postalCode, after.postalCode)

  auditSafe(prisma, req, {
    action: 'PROFILE_UPDATE',
    userId,
    targetType: 'User',
    targetId: String(userId),
    metadata: { changes },
  })
}
