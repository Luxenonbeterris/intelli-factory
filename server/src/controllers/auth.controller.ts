import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../prisma'
import { signToken } from '../utils/jwt'

const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['CUSTOMER', 'FACTORY', 'LOGISTIC']),
  location: z.string().min(1),
})

export async function register(req: Request, res: Response): Promise<void> {
  const parse = RegisterSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid input', details: parse.error.format() })
    return
  }

  const { email, password, name, role, location } = parse.data

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    res.status(400).json({ error: 'Email already registered' })
    return
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hash, name, role, location },
  })

  res.json({ message: 'Registered successfully', user: { id: user.id, email: user.email } })
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

  const token = signToken({ userId: user.id })
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
}

export async function profile(req: Request, res: Response) {
  res.json({ user: req.user })
}
