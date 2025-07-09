import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

export interface AppRoute {
  path: string
  element: React.FC
  isAuth: boolean
  role?: string
}

export const routes: AppRoute[] = [
  {
    path: '/',
    element: HomePage,
    isAuth: false,
  },
  {
    path: '/login',
    element: LoginPage,
    isAuth: false,
  },
]
