import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import prisma from '../prisma'
import { RegisterSchema } from '../schemas/registerSchema'
import { signToken } from '../utils/jwt'

export async function register(req: Request, res: Response): Promise<void> {
  const parse = RegisterSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid input', details: parse.error.format() })
    return
  }

  const { email, password, name, role, location, countryId, regionId } = parse.data

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    res.status(400).json({ error: 'Email already registered' })
    return
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name,
      role,
      location,
      countryId,
      regionId,
    },
  })

  res.json({
    message: 'Registered successfully',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
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
