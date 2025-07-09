import { BrowserRouter, useRoutes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import { routes } from './routes.data'

function AppRoutes() {
  return useRoutes(
    routes.map((route) => ({
      path: route.path,
      element: (
        <DefaultLayout>
          <route.element />
        </DefaultLayout>
      ),
    }))
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
