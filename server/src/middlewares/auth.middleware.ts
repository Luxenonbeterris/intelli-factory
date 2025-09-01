// server/src/middlewares/auth.middleware.ts
import { NextFunction, Request, Response } from 'express'
import prisma from '../prisma'
import { verifyToken } from '../utils/jwt'

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token missing' })
    return
  }

  try {
    const payload = verifyToken(token) as { userId: number }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        emailVerified: true,
        countryId: true,
        regionId: true,
        updatedAt: true,
        street: true,
        postalCode: true,
      },
    })

    if (!user) {
      res.status(401).json({ error: 'Invalid user' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
