// client/src/routes/RoleRouter.tsx
import CustomerHome from '../pages/roles/CustomerHome'
import FactoryHome from '../pages/roles/FactoryHome'
import LogisticHome from '../pages/roles/LogisticHome'
import ManagerHome from '../pages/roles/ManagerHome'
import { useAuthStore } from '../store/authStore'

export default function RoleRouter() {
  const hydrated = useAuthStore((s) => s.hydrated) // ✅ wait for hydration
  const role = useAuthStore((s) => s.user?.role)

  if (!hydrated) {
    // first paint after refresh – store not restored yet
    return <div className="p-6 text-sm text-gray-600">Loading…</div>
  }

  if (!role) {
    // hydrated but we still have no role → we likely need to fetch /me
    return <div className="p-6 text-sm text-gray-600">Loading your workspace…</div>
  }

  if (role === 'CUSTOMER') return <CustomerHome />
  if (role === 'FACTORY') return <FactoryHome />
  if (role === 'LOGISTIC') return <LogisticHome />
  if (role === 'MANAGER') return <ManagerHome />

  return <div className="p-6">Unknown role.</div>
}
