import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import HomePage from './pages/homepage/HomePage'

export interface AppRoute {
  path: string
  element: React.FC
  isAuth: boolean
  role?: string
  layout?: boolean
}

export const routes: AppRoute[] = [
  {
    path: '/',
    element: HomePage,
    isAuth: false,
  },
  {
    path: '/login',
    element: LoginForm,
    isAuth: false,
    layout: false,
  },
  {
    path: '/register',
    element: RegisterForm,
    isAuth: false,
    layout: false,
  },
]
