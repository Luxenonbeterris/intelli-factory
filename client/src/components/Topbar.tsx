// client/src/components/Topbar.tsx
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Topbar() {
  const user = useAuthStore((s) => s.user)
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="font-semibold">
          Intelli Factory
        </Link>

        <nav className="flex items-center gap-4">
          {/* role-specific quick links */}
          <Link to="/" className="text-sm hover:underline">
            Dashboard
          </Link>
          <Link to="/history" className="text-sm hover:underline">
            History
          </Link>

          {/* account menu */}
          <div className="relative group">
            <button className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50">
              {user?.name ?? user?.email ?? 'Account'}
            </button>
            <div className="invisible absolute right-0 z-10 mt-2 w-48 rounded-lg border bg-white p-2 opacity-0 shadow group-hover:visible group-hover:opacity-100">
              <Link className="block rounded px-3 py-2 text-sm hover:bg-gray-50" to="/account">
                My Account
              </Link>
              <Link className="block rounded px-3 py-2 text-sm hover:bg-gray-50" to="/logout">
                Logout
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
