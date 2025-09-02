// client/src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import { routes } from './routes.data'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicGate from './routes/PublicGate'
import type { User } from './store/authStore'
import { useAuthStore } from './store/authStore'

function BootstrapAuth() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const markHydrated = useAuthStore((s) => s.markHydrated)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const raw = localStorage.getItem('user')
    try {
      if (token && raw) {
        const parsed = JSON.parse(raw)

        const candidate = parsed?.user ?? parsed

        if (candidate && typeof candidate === 'object' && 'password' in candidate) {
          delete (candidate as Record<string, unknown>).password
        }

        setAuth({ token, user: candidate as User, persist: false })
      } else {
        clearAuth(false)
      }
    } finally {
      markHydrated()
    }
  }, [setAuth, clearAuth, markHydrated])
  return null
}

function AppRoutes() {
  return useRoutes(
    routes.map(({ path, element: Element, isAuth, layout, redirectAuthed }) => {
      let node = <Element />

      if (isAuth) {
        node = <ProtectedRoute>{node}</ProtectedRoute>
        if (layout !== false) node = <DefaultLayout>{node}</DefaultLayout>
      } else {
        // Only redirect authed users for pages that asked for it (login/register/verify)
        if (redirectAuthed) node = <PublicGate>{node}</PublicGate>
        if (layout !== false) node = <DefaultLayout>{node}</DefaultLayout>
      }

      return { path, element: node }
    })
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <BootstrapAuth />
      <AppRoutes />
    </BrowserRouter>
  )
}
