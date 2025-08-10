// client/src/components/auth/VerifyEmail.tsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function VerifyEmail() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading')
  const [message, setMessage] = useState('Verifying…')
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const token = sp.get('token')
    if (!token) {
      setStatus('fail')
      setMessage('Token отсутствует')
      return
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

    ;(async () => {
      try {
        const res = await fetch(`${apiBase}/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: 'GET',
        })
        const text = await res.text()

        if (res.ok) {
          setStatus('ok')
          setMessage(text || 'Email confirmation success!')
          setTimeout(() => navigate('/login'), 1500)
        } else {
          setStatus('fail')
          setMessage(text || `Verification failed (HTTP ${res.status})`)
        }
      } catch {
        setStatus('fail')
        setMessage('Network error')
      }
    })()
  }, [navigate, sp])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-300 px-4">
      <div className="p-6 rounded-lg shadow bg-white max-w-md w-full text-center">
        {status === 'loading' && <p className="animate-pulse text-gray-700">Verifying…</p>}
        {status === 'ok' && <p className="text-green-700 font-semibold">{message}</p>}
        {status === 'fail' && <p className="text-red-700 font-semibold">{message}</p>}

        <div className="mt-4">
          <a className="underline text-blue-600" href="/login">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
