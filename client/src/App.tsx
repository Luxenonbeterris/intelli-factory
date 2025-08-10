// client/src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import { routes } from './routes.data'
import { useAuthStore } from './store/authStore'

function BootstrapAuth() {
  const setAuth = useAuthStore((s) => s.setAuth)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (token && u) {
      try {
        setAuth({ token, user: JSON.parse(u) })
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [setAuth])
  return null
}

function AppRoutes() {
  return useRoutes(
    routes.map(({ path, element: Element, layout }) => ({
      path,
      element:
        layout === false ? (
          <Element />
        ) : (
          <DefaultLayout>
            <Element />
          </DefaultLayout>
        ),
    }))
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
