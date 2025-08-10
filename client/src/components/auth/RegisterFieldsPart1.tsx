// client/src/components/auth/RegisterFieldsPart1.tsx
import type { UiRole } from '../../hooks/useRegisterForm'

interface Props {
  t: (k: string, def?: string) => string
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  confirmPassword: string
  setConfirmPassword: (v: string) => void
  name: string
  setName: (v: string) => void
  role: UiRole
  setRole: (v: UiRole) => void
}

export default function RegisterFieldsPart1({
  t,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  role,
  setRole,
}: Props) {
  return (
    <>
      <label className="flex flex-col text-sm font-semibold text-gray-800">
        {t('register.email')}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('register.emailPlaceholder')}
          required
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        />
      </label>

      <label className="flex flex-col text-sm font-semibold text-gray-800">
        {t('register.password')}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('register.passwordPlaceholder')}
          required
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        />
      </label>

      <label className="flex flex-col text-sm font-semibold text-gray-800">
        {t('register.confirmPassword')}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('register.confirmPasswordPlaceholder')}
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        />
      </label>

      <label className="flex flex-col text-sm font-semibold text-gray-800">
        {t('register.name')}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('register.namePlaceholder')}
          required
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        />
      </label>

      <label className="flex flex-col text-sm font-semibold text-gray-800">
        {t('register.role')}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UiRole)}
          className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-sm transition"
        >
          <option value="customer">{t('register.roles.customer')}</option>
          <option value="factory">{t('register.roles.factory')}</option>
          <option value="logistic">{t('register.roles.logistic')}</option>
        </select>
      </label>
    </>
  )
}
