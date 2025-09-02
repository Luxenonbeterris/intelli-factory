// client/src/store/authStore.ts
import { create } from 'zustand'

export type Role = 'CUSTOMER' | 'FACTORY' | 'LOGISTIC' | 'MANAGER'
export type User = {
  id: number
  email: string
  role: Role
  name?: string | null
  emailVerified?: boolean
  createdAt?: string
  countryId?: number | null
  regionId?: number | null
  street?: string | null
  postalCode?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  hydrated: boolean
  setAuth: (p: { user: User; token: string; persist?: boolean }) => void
  clearAuth: (persist?: boolean) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  setUser: (partial: Partial<User>, persist?: boolean) => void
  markHydrated: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  hydrated: false,

  setAuth: ({ user, token, persist = true }) => {
    if (persist) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }
    set({ user, token, error: null })
  },

  clearAuth: (persist = true) => {
    if (persist) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    set({ user: null, token: null })
  },

  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),

  setUser: (partial, persist = true) => {
    const current = get().user
    if (!current) return
    const next = { ...current, ...partial }
    if (persist) {
      localStorage.setItem('user', JSON.stringify(next))
    }
    set({ user: next })
  },

  markHydrated: () => set({ hydrated: true }),
}))
