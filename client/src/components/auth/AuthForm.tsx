// client/src/components/auth/AuthForm.tsx
import { FormEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface ErrorToken {
  key: string
  values?: Record<string, unknown>
}

interface AuthFormProps {
  title: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  loading?: boolean
  error?: ErrorToken | undefined
  children: ReactNode
  showRegisterLink?: boolean
}

export default function AuthForm({ title, onSubmit, loading, error, children }: AuthFormProps) {
  const { t } = useTranslation()
  const submitText = loading ? t('auth.signingIn') : t('auth.submit')

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 w-80 sm:w-md p-8 border border-blue-300 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md"
      noValidate
    >
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>

      {children}

      {error && (
        <p role="alert" aria-live="assertive" className="text-red-600 text-center text-sm">
          {t(error.key, error.values)}
        </p>
      )}

      <button
        type="submit"
        disabled={!!loading}
        aria-busy={!!loading}
        className="bg-blue-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {submitText}
      </button>
    </form>
  )
}
