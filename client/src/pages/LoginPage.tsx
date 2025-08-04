import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: аутентификация
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-blue-300 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          {t('login.title', 'Sign In')}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col text-gray-800 font-semibold text-sm">
            {t('login.email', 'Email')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder', 'Enter your email')}
              required
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col text-gray-800 font-semibold text-sm">
            {t('login.password', 'Password')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder', 'Enter your password')}
              required
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? t('login.loading', 'Signing In...') : t('login.submit', 'Sign In')}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          {t('login.noAccount', "Don't have an account?")}{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
          >
            {t('login.register', 'Register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
