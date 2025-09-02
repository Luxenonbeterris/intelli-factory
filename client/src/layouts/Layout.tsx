// client/src/layouts/Layout.tsx
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`
      }
      end
    >
      {children}
    </NavLink>
  )
}

export default function DefaultLayout({ children }: { children?: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  return (
    <div className="min-h-screen grid md:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="border-r bg-white p-4">
        <div className="mb-6">
          <Link to="/" className="text-xl font-bold text-blue-800">
            SmartManagement
          </Link>
          <div className="text-xs text-gray-500 mt-1">{user?.role ?? '—'}</div>
        </div>
        <nav className="space-y-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/app/account">My Account</NavItem>
          <NavItem to="/history">History</NavItem>
        </nav>
      </aside>

      {/* Content */}
      <main className="p-6 bg-gray-50">{children ?? <Outlet />}</main>
    </div>
  )
}
