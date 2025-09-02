// client/src/routes.data.ts
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import VerifyEmail from './components/auth/VerifyEmail'
import VerifyEmailNotice from './components/auth/VerifyEmailNotice'
import MyAccount from './pages/account/MyAccount'
import HomePage from './pages/homepage/HomePage'
import RoleRouter from './routes/RoleRouter'

export interface AppRoute {
  path: string
  element: React.FC
  isAuth: boolean
  layout?: boolean
  redirectAuthed?: boolean // 👈 new
}

export const routes: AppRoute[] = [
  // Public (no redirect for authed users)
  { path: '/', element: HomePage, isAuth: false, layout: true, redirectAuthed: false },

  // Public auth pages (authed users get redirected to /app)
  { path: '/login', element: LoginForm, isAuth: false, layout: false, redirectAuthed: true },
  { path: '/register', element: RegisterForm, isAuth: false, layout: false, redirectAuthed: true },
  {
    path: '/verify-email',
    element: VerifyEmail,
    isAuth: false,
    layout: false,
    redirectAuthed: true,
  },
  {
    path: '/verify-email-notify',
    element: VerifyEmailNotice,
    isAuth: false,
    layout: false,
    redirectAuthed: true,
  },

  // Protected app entry points
  { path: '/app', element: RoleRouter, isAuth: true, layout: false },
  { path: '/app/account', element: MyAccount, isAuth: true, layout: false },
]
