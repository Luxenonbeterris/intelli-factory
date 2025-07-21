import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../../src/app'
import prisma from '../../src/prisma'

describe('Auth Routes', () => {
  const testUser = {
    email: faker.internet.email(),
    password: '123456',
    name: 'Route Tester',
    role: 'CUSTOMER' as const,
    location: 'Routetown',
  }

  let token: string

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { name: 'Route Tester' } })
  })

  it('POST /auth/register should return 200 and user object', async () => {
    const res = await request(app).post('/auth/register').send(testUser)

    expect(res.status).toBe(200)
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user.email).toBe(testUser.email)
  })

  it('POST /auth/login should return 200 and token', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    token = res.body.token
  })

  it('GET /auth/profile without token should return 401', async () => {
    const res = await request(app).get('/auth/profile')
    expect(res.status).toBe(401)
  })

  it('GET /auth/profile with token should return user data', async () => {
    const res = await request(app).get('/auth/profile').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(testUser.email)
  })
})
