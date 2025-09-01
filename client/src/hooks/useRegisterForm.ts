// client/src/hooks/useRegisterForm.ts
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { registerUser } from '../api/auth'
import type { ErrorToken } from '../components/auth/AuthForm'
import { validateEmail, validatePassword } from '../utils/validation'

export type UiRole = 'customer' | 'factory' | 'logistic'
export type BackendRole = 'CUSTOMER' | 'FACTORY' | 'LOGISTIC'

export interface Country {
  id: number
  name: string
}
export interface Region {
  id: number
  name: string
}

const mapUiToBackendRole = (ui: UiRole): BackendRole => ui.toUpperCase() as BackendRole

export function useRegisterForm() {
  const { t, i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UiRole>('customer')
  const [street, setStreet] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [countryId, setCountryId] = useState<number | null>(null)
  const [regionId, setRegionId] = useState<number | null>(null)

  const [countries, setCountries] = useState<Country[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [error, setError] = useState<ErrorToken | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [regionsLoading, setRegionsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null) // NEW

  // Language code like "en", "ru", "zh"
  const lang = useMemo(
    () => (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0].toLowerCase(),
    [i18n.resolvedLanguage, i18n.language]
  )

  // Fetch countries on lang change
  useEffect(() => {
    const ac = new AbortController()
    fetch(`/api/countries?lang=${lang}`, { signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setCountries)
      .catch((e) => {
        if (e.name !== 'AbortError') setCountries([])
      })
    return () => ac.abort()
  }, [lang])

  // Fetch regions when country changes
  useEffect(() => {
    if (!countryId) {
      setRegions([])
      setRegionId(null)
      setRegionsLoading(false)
      return
    }
    const ac = new AbortController()
    setRegionsLoading(true)
    setRegions([])
    setRegionId(null)
    fetch(`/api/regions?countryId=${countryId}&lang=${lang}`, { signal: ac.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setRegions)
      .catch((e) => {
        if (e.name !== 'AbortError') setRegions([])
      })
      .finally(() => setRegionsLoading(false))
    return () => ac.abort()
  }, [countryId, lang])

  // Submit handler (kept here to keep logic out of UI)
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(undefined)
    setSuccess(false)

    if (!validateEmail(email)) {
      setError({ key: 'register.invalidEmail' })
      return
    }
    if (!validatePassword(password)) {
      setError({ key: 'register.passwordLength' })
      return
    }
    if (password !== confirmPassword) {
      setError({ key: 'register.passwordMismatch' })
      return
    }
    if (!name.trim()) {
      setError({ key: 'register.nameRequired' })
      return
    }
    if (!countryId) {
      setError({ key: 'register.countryRequired' })
      return
    }

    setLoading(true)
    try {
      await registerUser({
        email: email.trim(),
        password,
        name: name.trim(),
        role: mapUiToBackendRole(role),
        countryId: countryId ?? undefined,
        regionId: regionId ?? undefined,
        street: street.trim() || undefined,
        postalCode: postalCode.trim() || undefined,
      })

      setSubmittedEmail(email.trim())

      setSuccess(true)
      // Reset form
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setName('')
      setStreet('')
      setPostalCode('')
      setCountryId(null)
      setRegionId(null)
      setRole('customer')
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        setError({ key: 'register.errorWithMsg', values: { msg: err.message } })
      } else {
        setError({ key: 'register.error' })
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    t,
    // values
    email,
    password,
    confirmPassword,
    name,
    role,
    street,
    postalCode,
    countryId,
    regionId,
    // setters
    setEmail,
    setStreet,
    setPostalCode,
    setPassword,
    setConfirmPassword,
    setName,
    setRole,
    setCountryId,
    setRegionId,
    // data
    countries,
    regions,
    regionsLoading,
    // meta
    error,
    success,
    loading,
    // actions
    submittedEmail,
    onSubmit,
  }
}
