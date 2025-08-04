import { useState } from 'react'
import { getProfile, loginUser } from '../api/auth'

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const { token } = await loginUser(email, password)
      localStorage.setItem('token', token)
      setToken(token)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const fetchProfile = async () => {
    if (!token) return null
    try {
      return await getProfile(token)
    } catch {
      logout()
      return null
    }
  }

  return { token, login, logout, loading, error, fetchProfile }
}
