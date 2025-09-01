// client/src/api/auth.ts
import type { User } from '../types/auth'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
const BASE = `${API_BASE}/auth`

export const registerUser = async (data: {
  email: string
  password: string
  name?: string
  role?: string
  countryId?: number
  regionId?: number
  street?: string
  postalCode?: string
}): Promise<{ message: string; user: Pick<User, 'id' | 'email' | 'role'> }> => {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) {
    if (import.meta.env.DEV) globalThis.console?.debug('Register error payload:', json)
    throw new Error(json.error || JSON.stringify(json.details || json))
  }
  return json
}

export const loginUser = async (email: string, password: string): Promise<{ token: string }> => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Login failed')
  return json as { token: string }
}

export const getProfile = async (token: string): Promise<User> => {
  const res = await fetch(`${BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Profile fetch failed')
  return json as User
}
