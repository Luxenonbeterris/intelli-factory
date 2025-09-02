// client/src/routes/PublicGate.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

/** Only used on routes that set redirectAuthed: true */
export default function PublicGate({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const hydrated = useAuthStore((s) => s.hydrated)
  const nav = useNavigate()

  useEffect(() => {
    if (!hydrated) return
    if (token) nav('/app', { replace: true })
  }, [hydrated, token, nav])

  if (!hydrated) return null
  return <>{children}</>
}
