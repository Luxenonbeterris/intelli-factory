// server/src/services/verificationService.ts
import crypto from 'crypto'
import prisma from '../prisma'

const hash = (t: string) => crypto.createHash('sha256').update(t).digest('hex')
export const makeToken = () => crypto.randomBytes(32).toString('base64url')

export async function createVerificationToken(userId: number, minutes = 30) {
  const raw = makeToken()
  await prisma.verificationToken.create({
    data: {
      userId,
      tokenHash: hash(raw),
      type: 'EMAIL_VERIFICATION',
      expiresAt: new Date(Date.now() + minutes * 60 * 1000),
    },
  })
  return raw
}

export async function findValidVerification(raw: string) {
  return prisma.verificationToken.findFirst({
    where: {
      tokenHash: hash(raw),
      type: 'EMAIL_VERIFICATION',
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
    include: { user: true },
  })
}

export async function consumeVerification(id: number) {
  await prisma.verificationToken.update({ where: { id }, data: { usedAt: new Date() } })
}
