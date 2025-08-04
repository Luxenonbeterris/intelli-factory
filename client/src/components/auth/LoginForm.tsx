import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LanguageSwitcher from '../LanguageSwitcher'
import AuthForm from './AuthForm'

export default function LoginForm() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-tr from-blue-100 to-blue-300">
      <AuthForm
        title={t('login.title', 'Sign In')}
        onSubmit={onSubmit}
        loading={loading}
        error={error ?? undefined}
        showRegisterLink
      >
        <LanguageSwitcher />

        <label className="flex flex-col text-sm font-semibold text-gray-800">
          {t('login.email', 'Email')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.emailPlaceholder', 'Enter your email')}
            required
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
          />
        </label>

        <label className="flex flex-col text-sm font-semibold text-gray-800">
          {t('login.password', 'Password')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.passwordPlaceholder', 'Enter your password')}
            required
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
          />
        </label>
      </AuthForm>

      <p className="mt-6 text-center text-gray-700">
        {t('login.noAccount', "Don't have an account?")}{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
        >
          {t('login.register', 'Register')}
        </Link>
      </p>
    </div>
  )
}
