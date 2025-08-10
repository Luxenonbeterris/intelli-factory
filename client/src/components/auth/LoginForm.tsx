// client/src/components/auth/LoginForm.tsx
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LanguageSwitcher from '../LanguageSwitcher'
import AuthForm, { type ErrorToken } from './AuthForm'

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

export default function LoginForm() {
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()

  const uiError: ErrorToken | undefined = error
    ? { key: 'login.errorWithMsg', values: { msg: error } }
    : undefined

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const canSubmit = useMemo(() => isEmail(email) && password.length >= 6, [email, password])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit || loading) return
    await login({ email, password })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-tr from-blue-100 to-blue-300">
      <AuthForm
        title={t('login.title', 'Sign In')}
        onSubmit={onSubmit}
        loading={loading}
        error={uiError}
      >
        {/* IMPORTANT: buttons inside this component must be type="button" to avoid unintended submits */}
        <LanguageSwitcher />

        {/* Email */}
        <label className="flex flex-col text-sm font-semibold text-gray-800">
          {t('login.email', 'Email')}
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.emailPlaceholder', 'Enter your email')}
            required
            autoFocus
            autoComplete="email"
            inputMode="email"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
            aria-invalid={email.length > 0 && !isEmail(email)}
          />
        </label>

        {/* Password */}
        <label className="flex flex-col text-sm font-semibold text-gray-800">
          {t('login.password', 'Password')}
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.passwordPlaceholder', 'Enter your password')}
            required
            autoComplete="current-password"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
            aria-invalid={password.length > 0 && password.length < 6}
          />
        </label>

        {/* Lightweight inline hints (no blocking, just guidance) */}
        {!isEmail(email) && email.length > 0 && (
          <p className="text-xs text-amber-700">
            {t('login.hintInvalidEmail', 'Invalid email format')}
          </p>
        )}
        {password.length > 0 && password.length < 6 && (
          <p className="text-xs text-amber-700">
            {t('login.hintShortPassword', 'Password must be ≥ 6 chars')}
          </p>
        )}
      </AuthForm>

      {/* “No account?” footer */}
      <p className="mt-6 text-center text-gray-700">
        {t('login.noAccount', "Don't have an account?")}{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
        >
          {t('login.register', 'Register')}
        </Link>
      </p>

      {/* Cosmetic: prevent pointer on disabled submit */}
      <style>{`button[type="submit"]:disabled { cursor: not-allowed; }`}</style>
    </div>
  )
}
