// client/src/hooks/useAuth.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, loginUser } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (
    { email, password }: { email: string; password: string },
    redirectTo: string = '/'
  ) => {
    setLoading(true)
    setError(null)
    try {
      const { token } = await loginUser(email, password)
      localStorage.setItem('token', token)
      setToken(token)

      const user = await getProfile(token)
      setAuth({ user, token })

      navigate(redirectTo, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    useAuthStore.getState().clearAuth()
  }

  const fetchProfile = async () => {
    if (!token) return null
    try {
      const user = await getProfile(token)
      setAuth({ user, token })
      return user
    } catch {
      logout()
      return null
    }
  }

  return { token, login, logout, loading, error, fetchProfile }
}
