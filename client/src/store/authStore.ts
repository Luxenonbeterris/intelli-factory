// client/src/store/authStore.ts
import { create } from 'zustand'

type Role = 'CUSTOMER' | 'FACTORY' | 'LOGISTIC'
type User = { id: number; email: string; role: Role }

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  setAuth: (p: { user: User; token: string }) => void
  clearAuth: () => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  setAuth: ({ user, token }) => set({ user, token, error: null }),
  clearAuth: () => set({ user: null, token: null }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
}))
