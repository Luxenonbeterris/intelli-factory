import { Request, Response } from 'express'
import { authMiddleware } from '../../src/middlewares/auth.middleware'
import prisma from '../../src/prisma'
import { signToken } from '../../src/utils/jwt'

const mockUser = {
  email: 'middleware@example.com',
  name: 'Middleware User',
  role: 'CUSTOMER' as const,
  location: 'Nowhere',
  password: 'hashed-password',
}

describe('authMiddleware', () => {
  let userId: number
  let token: string

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: mockUser.email } })

    const created = await prisma.user.create({ data: mockUser })
    userId = created.id
    token = signToken({ userId })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: mockUser.email } })
    await prisma.$disconnect()
  })

  const mockResponse = () => {
    const res = {} as Response
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  const mockNext = jest.fn()

  it('should return 401 if token is missing', async () => {
    const req = { headers: {} } as Request
    const res = mockResponse()

    await authMiddleware(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token missing' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 for invalid token', async () => {
    const req = {
      headers: { authorization: 'Bearer invalid.token.here' },
    } as Request
    const res = mockResponse()

    await authMiddleware(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 401 if user does not exist', async () => {
    const fakeToken = signToken({ userId: 999999 })
    const req = {
      headers: { authorization: `Bearer ${fakeToken}` },
    } as Request
    const res = mockResponse()

    await authMiddleware(req, res, mockNext)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user' })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should attach user and call next for valid token', async () => {
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request
    const res = mockResponse()

    await authMiddleware(req, res, mockNext)

    expect(req.user).toMatchObject({
      email: mockUser.email,
      role: mockUser.role,
    })
    expect(mockNext).toHaveBeenCalled()
  })
})
