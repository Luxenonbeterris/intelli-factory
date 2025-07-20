import dotenv from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'

dotenv.config()

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in .env')
}

const SECRET = process.env.JWT_SECRET

interface JwtPayload {
  userId: number
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: '1d',
    algorithm: 'HS256',
  }
  return jwt.sign(payload, SECRET, options)
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET, { algorithms: ['HS256'] }) as JwtPayload
}
