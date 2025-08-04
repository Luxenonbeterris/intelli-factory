import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { registerUser } from '../../api/auth'
import { validateEmail, validatePassword } from '../../utils/validation'
import LanguageSwitcher from '../LanguageSwitcher'
import AuthForm from './AuthForm'

export default function RegisterForm() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(undefined)
    setSuccess(false)

    if (!validateEmail(email)) {
      setError(t('register.invalidEmail', 'Invalid email format'))
      return
    }

    if (!validatePassword(password)) {
      setError(t('register.passwordLength', 'Password must be at least 6 characters'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch', 'Passwords do not match'))
      return
    }

    setLoading(true)
    try {
      await registerUser({ email, password }) // name, role и т.д. — позже
      setSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t('register.error', 'Registration failed'))
      } else {
        setError(t('register.error', 'Registration failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-tr from-blue-100 to-blue-300">
      <AuthForm
        title={t('register.title', 'Create an Account')}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        showRegisterLink={false}
      >
        <LanguageSwitcher />

        <label className="flex flex-col text-sm font-semibold text-gray-800">
          {t('login.email', 'Email')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('register.emailPlaceholder', 'Enter your email')}
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
            placeholder={t('register.passwordPlaceholder', 'Enter your password')}
            required
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
          />
        </label>

        <label className="flex flex-col text-sm font-semibold text-gray-800">
          {t('register.confirmPassword', 'Confirm Password')}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')}
            required
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
          />
        </label>
      </AuthForm>

      {success && (
        <p className="mt-4 font-semibold text-green-700">
          {t('register.success', 'Check your email for verification.')}
        </p>
      )}

      <p className="mt-6 text-center text-gray-700">
        {t('login.haveAccount', 'Already have an account?')}{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
        >
          {t('login.title', 'Sign In')}
        </Link>
      </p>
    </div>
  )
}
