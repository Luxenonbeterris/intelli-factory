// server/src/controllers/auth.controller.ts
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import prisma from '../prisma'
import { RegisterSchema } from '../schemas/registerSchema'
import { sendVerificationEmail } from '../services/mailService'
import { createVerificationToken, deleteToken, verifyToken } from '../services/verificationService'
import { signToken } from '../utils/jwt'

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = RegisterSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.format() })
    return
  }

  const { email, password, name, role, location, countryId, regionId } = parsed.data

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
      location,
      countryId,
      regionId: regionId ?? null, // ← безопасно для стран без регионов
    },
  })

  const token = await createVerificationToken(user.id)
  await sendVerificationEmail(user.email, token)

  res.status(201).json({
    message: 'Registered successfully, please verify your email',
    user: { id: user.id, email: user.email, role: user.role },
  })
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const token = req.query.token as string
    if (!token) {
      res.status(400).send('Token отсутствует')
      return
    }

    const dbToken = await verifyToken(token)
    if (!dbToken) {
      res.status(400).send('Неверный или просроченный токен')
      return
    }

    await prisma.user.update({
      where: { id: dbToken.userId },
      data: { emailVerified: true },
    })

    await deleteToken(dbToken.id)

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
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  if (!user.emailVerified) {
    res.status(403).json({ error: 'Email not verified. Please check your inbox.' })
    return
  }

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
