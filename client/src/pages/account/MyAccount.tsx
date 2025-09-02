// client/src/pages/account/MyAccount.tsx
import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'

export default function MyAccount() {
  const { user, loading, error, saveProfile } = useProfile()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    countryId: user?.countryId ?? null,
    regionId: user?.regionId ?? null,
    street: user?.street ?? '',
    postalCode: user?.postalCode ?? '',
  })
  const [saving, setSaving] = useState(false)
  const dirty =
    JSON.stringify({
      name: user?.name ?? '',
      countryId: user?.countryId ?? null,
      regionId: user?.regionId ?? null,
      street: user?.street ?? '',
      postalCode: user?.postalCode ?? '',
    }) !== JSON.stringify(form)

  if (loading && !user) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!user) return null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name || undefined,
        countryId: form.countryId,
        regionId: form.regionId,
        street: form.street || null,
        postalCode: form.postalCode || null,
      }
      await saveProfile(payload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Account</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-gray-600">Profile</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500">Email</label>
              <input
                disabled
                value={user.email}
                className="mt-1 w-full rounded border bg-gray-50 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500">Country ID</label>
                <input
                  type="number"
                  value={form.countryId ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      countryId: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Region ID</label>
                <input
                  type="number"
                  value={form.regionId ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      regionId: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Street</label>
              <input
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Postal Code</label>
              <input
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={!dirty || saving}
                className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <span className="text-xs text-gray-500">
                Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-gray-600">Security</h2>
          <p className="text-sm text-gray-500">
            Email verified: {user.emailVerified ? 'Yes' : 'No'}
          </p>
          {/* Future: change password, change email flows */}
        </section>
      </div>
    </div>
  )
}
