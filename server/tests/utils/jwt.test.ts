import dotenv from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { signToken, verifyToken } from '../../src/utils/jwt'

dotenv.config()

const testPayload = { userId: 123 }

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in .env')
}

const SECRET = process.env.JWT_SECRET

describe('JWT utils', () => {
  it('should sign a token that starts with valid JWT prefix', () => {
    const token = signToken(testPayload)
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
    expect(token).toMatch(/^eyJ/)
  })

  it('should verify a valid token and return payload', () => {
    const token = signToken(testPayload)
    const decoded = verifyToken(token)

    expect(decoded).toHaveProperty('userId', testPayload.userId)
  })

  it('should throw error for invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow()
  })

  it('should reject expired token (manually crafted)', () => {
    const options: SignOptions = {
      expiresIn: '1d',
      algorithm: 'HS256',
    }

    const expired = jwt.sign(testPayload, SECRET, options)

    expect(() => verifyToken(expired)).toThrow('jwt expired')
  })
})
