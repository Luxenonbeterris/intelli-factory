import { BrowserRouter, useRoutes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import { routes } from './routes.data'

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
      <AppRoutes />
    </BrowserRouter>
  )
}
