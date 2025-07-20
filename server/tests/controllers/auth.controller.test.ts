import { faker } from '@faker-js/faker'
import request from 'supertest'
import app from '../../src/app'
import prisma from '../../src/prisma'
const email = faker.internet.email()

describe('Auth Controller', () => {
  const testUser = {
    email: email,
    password: '123456',
    name: 'Test User',
    role: 'CUSTOMER',
    location: 'Testville',
  }

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } })
  })

  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send(testUser)
    expect(res.status).toBe(200)
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user.email).toBe(testUser.email)
  })
})
