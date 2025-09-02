// client/src/hooks/useProfile.ts
import { useEffect, useState } from 'react'
import { getMe, updateMe } from '../api/profile'
import { useAuthStore } from '../store/authStore'

export function useProfile() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || (user && user.createdAt)) return
    setLoading(true)
    getMe(token)
      .then((u) => setUser(u))
      .catch((e) => setError(e.message || 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [token, user, setUser])

  async function saveProfile(patch: Parameters<typeof updateMe>[1]) {
    if (!token) throw new Error('No token')
    const updated = await updateMe(token, patch)
    setUser(updated)
    return updated
  }

  return { user, loading, error, saveProfile }
}
