const BASE = `${import.meta.env.VITE_API_BASE_URL}/auth`

export const registerUser = async (data: {
  email: string
  password: string
  name?: string
  role?: string
  location?: string
  countryId?: string
  regionId?: string
}) => {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Registration failed')
  return json
}

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Login failed')
  return json
}

export const getProfile = async (token: string) => {
  const res = await fetch(`${BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Profile fetch failed')
  return json
}
