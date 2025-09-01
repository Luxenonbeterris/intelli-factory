// client/src/components/auth/RegisterForm.tsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterForm } from '../../hooks/useRegisterForm'
import LanguageSwitcher from '../LanguageSwitcher'
import AuthForm from './AuthForm'
import RegisterFieldsPart1 from './RegisterFieldsPart1'
import RegisterFieldsPart2 from './RegisterFieldsPart2'

type Step = 1 | 2
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

export default function RegisterForm() {
  const {
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
    street,
    setStreet,
    postalCode,
    setPostalCode,
    countryId,
    setCountryId,
    regionId,
    setRegionId,
    countries,
    regions,
    regionsLoading,
    error,
    success,
    submittedEmail,
    loading,
    onSubmit,
  } = useRegisterForm()

  const tSimple = (k: string, def?: string) => t(k, { defaultValue: def })
  const [step, setStep] = useState<Step>(1)

  const navigate = useNavigate()

  useEffect(() => {
    if (success) {
      navigate('/verify-email-notify', { state: { email: submittedEmail ?? undefined } })
    }
  }, [success, submittedEmail, navigate])
  const canNextFrom1 = useMemo(
    () =>
      isEmail(email) &&
      password.length >= 6 &&
      confirmPassword === password &&
      name.trim().length > 0,
    [email, password, confirmPassword, name]
  )

  const canSubmitFrom2 = useMemo(() => {
    if (!countryId) return false
    if (regions.length > 0) return !!regionId
    return true
  }, [countryId, regionId, regions])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (step === 1) {
      e.preventDefault()
      if (canNextFrom1) setStep(2)
      return
    }
    onSubmit(e)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-tr from-blue-100 to-blue-300">
      <AuthForm
        title={
          step === 1
            ? t('register.titleStep1', 'Create account')
            : t('register.titleStep2', 'Profile & Location')
        }
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        showRegisterLink={false}
      >
        {/* Кнопки внутри дочерних компонентов — type="button" */}
        <LanguageSwitcher />

        {/* Индикатор шагов */}
        <div className="mb-2 flex items-center justify-center gap-4 text-sm font-semibold">
          <span className={step === 1 ? 'text-blue-600' : 'text-gray-500'}>
            {t('register.step1', 'Account')}
          </span>
          <span>•</span>
          <span className={step === 2 ? 'text-blue-600' : 'text-gray-500'}>
            {t('register.step2', 'Location')}
          </span>
        </div>

        {/* Поля без дублирования */}
        <div className="grid grid-cols-1 gap-3">
          {step === 1 ? (
            <>
              <RegisterFieldsPart1
                t={tSimple}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                name={name}
                setName={setName}
                role={role}
                setRole={setRole}
              />

              {/* Неблокирующие подсказки как в LoginForm */}
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
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-xs text-amber-700">
                  {t('register.hintPasswordsMismatch', 'Passwords do not match')}
                </p>
              )}
            </>
          ) : (
            <RegisterFieldsPart2
              t={tSimple}
              street={street}
              setStreet={setStreet}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
              countryId={countryId}
              setCountryId={setCountryId}
              regionId={regionId}
              setRegionId={setRegionId}
              countries={countries}
              regions={regions}
              regionsLoading={regionsLoading}
            />
          )}
        </div>

        {/* Навигация по шагам */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={step === 1 || loading}
            className="px-3 py-2 rounded border text-sm disabled:opacity-50"
          >
            {t('common.back', 'Back')}
          </button>

          {step === 1 ? (
            <button
              type="submit"
              disabled={!canNextFrom1 || loading}
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
            >
              {t('common.next', 'Next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmitFrom2 || loading}
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
            >
              {t('common.submit', 'Submit')}
            </button>
          )}
        </div>
      </AuthForm>

      <p className="mt-6 text-center text-gray-700">
        {t('login.haveAccount', 'Do have an account?')}{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
        >
          {t('login.login', 'Login')}
        </Link>
      </p>

      <style>{`button[type="submit"]:disabled { cursor: not-allowed; }`}</style>
    </div>
  )
}
