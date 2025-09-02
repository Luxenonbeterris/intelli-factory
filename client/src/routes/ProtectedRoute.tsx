// client/src/routes/ProtectedRoute.tsx
import { JSX } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token)
  const hydrated = useAuthStore((s) => s.hydrated)
  const location = useLocation()

  if (!hydrated) return null // or a tiny spinner

  if (!token) {
    return (
      <Navigate to="/login" replace state={{ redirectTo: location.pathname + location.search }} />
    )
  }
  return children
}
