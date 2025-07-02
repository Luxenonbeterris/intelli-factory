import { Routes, Route } from 'react-router-dom'
import routes from './routes.data'

function AppRoutes() {
  return (
    <Routes>
      {routes.map(({ path, component: Component }, index) => (
        <Route key={index} path={path} element={<Component />} />
      ))}
    </Routes>
  )
}

export default AppRoutes
