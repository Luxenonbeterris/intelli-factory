import { FormEvent, ReactNode } from 'react'

interface AuthFormProps {
  title: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  loading?: boolean
  error?: string
  children: ReactNode
  showRegisterLink: boolean
}

export default function AuthForm({ title, onSubmit, loading, error, children }: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 w-80 sm:w-md p-8 border border-blue-300 rounded-2xl shadow-lg bg-white/30 backdrop-blur-md"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>

      {children}

      {error && <p className="text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Submit
      </button>
    </form>
  )
}
