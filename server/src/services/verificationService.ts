// server/src/services/verificationService.ts
import crypto from 'crypto'
import prisma from '../prisma'

export function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

export async function createVerificationToken(userId: number) {
  const token = generateToken()
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.verificationToken.create({
    data: { userId, tokenHash, type: 'EMAIL_VERIFICATION', expiresAt },
  })

  return token
}

export async function verifyToken(token: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  return prisma.verificationToken.findFirst({
    where: { tokenHash, type: 'EMAIL_VERIFICATION', expiresAt: { gt: new Date() } },
    include: { user: true },
  })
}

export async function deleteToken(id: number) {
  return prisma.verificationToken.delete({ where: { id } })
}
