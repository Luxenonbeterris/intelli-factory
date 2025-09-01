// server/src/controllers/email.controller.ts
import { Request, Response } from 'express'
import prisma from '../prisma'
import { mailQueue } from '../queues/mailQueue'
import {
  consumeVerification,
  createVerificationToken,
  findValidVerification,
} from '../services/verificationService'

// POST /api/auth/email/verify  { token }
export async function postVerifyEmail(req: Request, res: Response) {
  const { token } = req.body ?? {}
  if (!token) {
    res.status(400).json({ error: 'Missing token' })
    return
  }

  const vt = await findValidVerification(String(token))
  if (!vt) {
    res.status(400).json({ error: 'Invalid or expired token' })
    return
  }

  await prisma.user.update({ where: { id: vt.userId }, data: { emailVerified: true } })
  await consumeVerification(vt.id)
  res.json({ ok: true })
}

// POST /api/auth/email/verify/resend
const cooldown = new Map<number, number>()

export async function postResendVerify(req: Request, res: Response) {
  const user = req.user!
  if (user.emailVerified) {
    res.json({ ok: true })
    return
  }

  const now = Date.now()
  const last = cooldown.get(user.id) || 0
  if (now - last < 60_000) {
    res.json({ ok: true })
    return
  }
  cooldown.set(user.id, now)

  const token = await createVerificationToken(user.id, 30)
  await mailQueue.add(
    'sendVerification',
    { email: user.email, token },
    {
      attempts: 5,
      backoff: { type: 'exponential', delay: 1500 },
      removeOnComplete: true,
    }
  )
  res.json({ ok: true })
}
