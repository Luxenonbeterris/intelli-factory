import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../../src/app'
import prisma from '../../src/prisma'

jest.setTimeout(15000)

describe('Auth Controller', () => {
  const baseUser = {
    password: '123456',
    name: 'Test User',
    role: 'CUSTOMER' as const,
    location: 'Testville',
  }

  let testUser: typeof baseUser & { email: string }
  let token: string

  beforeAll(async () => {
    testUser = { ...baseUser, email: faker.internet.email() }

    await prisma.user.deleteMany({ where: { name: testUser.name } })

    await request(app).post('/auth/register').send(testUser)
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { name: testUser.name } })
    await prisma.$disconnect()
  })

  it('should reject duplicate registration', async () => {
    const res = await request(app).post('/auth/register').send(testUser)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Email already registered')
  })

  it('should reject invalid registration input', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        ...testUser,
        email: 'invalid-email',
        password: '123',
      })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('details')
  })

  it('should login successfully with correct credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.token).toMatch(/^eyJ/)
    expect(res.body.user).toMatchObject({
      email: testUser.email,
      role: testUser.role,
    })

    token = res.body.token
  })

  it('should reject login with wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: 'wrong-password',
    })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error', 'Invalid credentials')
  })

  it('should reject login for nonexistent user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent_' + faker.internet.email(),
        password: '123456',
      })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error', 'Invalid credentials')
  })

  it('should return profile with valid token', async () => {
    const res = await request(app).get('/auth/profile').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({
      email: testUser.email,
      role: testUser.role,
    })
  })

  it('should reject profile access without token', async () => {
    const res = await request(app).get('/auth/profile')
    expect(res.status).toBe(401)
  })
})
