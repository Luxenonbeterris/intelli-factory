// server/src/controllers/auth.controller.ts
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import prisma from '../prisma'
import { mailQueue } from '../queues/mailQueue'
import { RegisterSchema } from '../schemas/registerSchema'
import {
  consumeVerification,
  createVerificationToken,
  findValidVerification,
} from '../services/verificationService'
import { auditSafe } from '../utils/audit-safe'
import { signToken } from '../utils/jwt'

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.format() })
    return
  }

  const { email, password, name, role, countryId, regionId, street, postalCode } = parsed.data

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    res.status(400).json({ error: 'Email already registered' })
    return
  }

  const hasRegions = (await prisma.region.count({ where: { countryId } })) > 0
  if (hasRegions && !regionId) {
    res.status(400).json({
      error: 'Invalid input',
      details: { regionId: { _errors: ['regionId is required for this country'] } },
    })
    return
  }
  if (regionId) {
    const valid = await prisma.region.findFirst({
      where: { id: regionId, countryId },
      select: { id: true },
    })
    if (!valid) {
      res.status(400).json({
        error: 'Invalid input',
        details: { regionId: { _errors: ['regionId does not belong to the selected country'] } },
      })
      return
    }
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      name,
      role,
      countryId,
      regionId: regionId ?? null,
      street: street ?? null,
      postalCode: postalCode ?? null,
    },
  })

  auditSafe(prisma, req, {
    action: 'ACCOUNT_REGISTERED',
    userId: user.id,
    targetType: 'User',
    targetId: String(user.id),
    metadata: { email },
  })

  const token = await createVerificationToken(user.id, 30)
  await mailQueue.add(
    'sendVerification',
    { email: user.email, token },
    {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1500 },
      removeOnComplete: true,
      removeOnFail: 100,
    }
  )

  res.status(201).json({
    message: 'Registered successfully, please verify your email',
    user: { id: user.id, email: user.email, role: user.role },
  })
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const token = String(req.query.token || '')
    if (!token) {
      res.status(400).send('Token отсутствует')
      return
    }

    const vt = await findValidVerification(token)
    if (!vt) {
      // optional audit on invalid token
      auditSafe(prisma, req, {
        action: 'LOGIN_FAILURE',
        targetType: 'VerificationToken',
        targetId: token.slice(0, 8) + '…', // don’t log full token
        metadata: { reason: 'invalid_or_expired_verification_token' },
      })
      res.status(400).send('Неверный или просроченный токен')
      return
    }

    // do the state change atomically
    await prisma.$transaction(async (trx) => {
      await trx.user.update({
        where: { id: vt.userId },
        data: { emailVerified: true },
      })
      await consumeVerification(vt.id) // adjust: pass trx if your function supports it
    })

    // (optional) fetch email for metadata; if you already have it, skip this query
    const verifiedUser = await prisma.user.findUnique({
      where: { id: vt.userId },
      select: { id: true, email: true },
    })

    auditSafe(prisma, req, {
      action: 'EMAIL_VERIFIED',
      userId: vt.userId,
      targetType: 'User',
      targetId: String(vt.userId),
      metadata: { email: verifiedUser?.email },
    })

    res.send('Email подтверждён успешно!')
  } catch (err) {
    console.error(err)
    res.status(500).send('Ошибка сервера')
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    auditSafe(prisma, req, {
      action: 'LOGIN_FAILURE',
      targetType: 'User',
      targetId: 'unknown',
      metadata: { emailAttempted: email, reason: 'user_not_found' },
    })
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    auditSafe(prisma, req, {
      action: 'LOGIN_FAILURE',
      userId: user.id, // subject (known)
      targetType: 'User',
      targetId: String(user.id),
      metadata: { emailAttempted: email, reason: 'bad_password' },
    })
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  if (!user.emailVerified) {
    auditSafe(prisma, req, {
      action: 'LOGIN_FAILURE',
      userId: user.id,
      targetType: 'User',
      targetId: String(user.id),
      metadata: { reason: 'email_not_verified' },
    })
    res.status(403).json({ error: 'Email not verified. Please check your inbox.' })
    return
  }

  // Success
  auditSafe(prisma, req, {
    action: 'LOGIN_SUCCESS',
    userId: user.id, // subject
    // actorId auto-fills from req.auth later in other routes; here it's anonymous pre-issue
    targetType: 'User',
    targetId: String(user.id),
    metadata: { email },
  })

  const token = signToken({ userId: user.id })

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
}

export async function profile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      country: { include: { translations: true } },
      region: { include: { translations: true } },
    },
  })

  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json({ user })
}
