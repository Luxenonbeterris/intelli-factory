// client/src/api/profile.ts
export async function getMe(token: string) {
  const res = await fetch('/api/profile/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to load profile')
  const { user } = await res.json()
  return user
}

export async function updateMe(
  token: string,
  patch: Partial<{
    name: string
    countryId: number | null
    regionId: number | null
    street: string | null
    postalCode: string | null
  }>
) {
  const res = await fetch('/api/profile/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error('Failed to update profile')
  const { user } = await res.json()
  return user
}
