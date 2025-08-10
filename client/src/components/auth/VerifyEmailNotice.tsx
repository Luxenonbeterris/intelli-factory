// client/src/components/auth/VerifyEmailNotice.tsx
import { Link, useLocation } from 'react-router-dom'

type VerifyEmailState = { email?: string }

export default function VerifyEmailNotice() {
  const location = useLocation()
  const email = (location.state as VerifyEmailState | null)?.email
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-tr from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded p-6 shadow">
        <h1 className="text-xl font-semibold mb-2">Check your email</h1>
        <p className="text-gray-700">
          We sent a verification link{' '}
          {email ? (
            <>
              to <b>{email}</b>
            </>
          ) : (
            'to your email'
          )}
          . Open the link to activate your account.
        </p>

        {/* Quick mail links (optional) */}
        <div className="mt-4 flex gap-3 text-sm">
          <a className="underline" href="https://mail.google.com" target="_blank" rel="noreferrer">
            Gmail
          </a>
          <a className="underline" href="https://outlook.live.com" target="_blank" rel="noreferrer">
            Outlook
          </a>
          <a className="underline" href="https://mail.yandex.com" target="_blank" rel="noreferrer">
            Yandex
          </a>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Go to login
          </Link>
          {/* Если есть эндпоинт resend — добавьте кнопку ниже */}
          {/* <button className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Resend</button> */}
        </div>
      </div>
    </div>
  )
}
