import React, { useState } from 'react'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="flex justify-between items-center p-4 shadow bg-white">
        <h1 className="text-xl font-bold text-blue-800">SmartManagement</h1>
        <button
          className="sm:hidden text-3xl cursor-pointer flex items-center justify-center w-12 h-12 transitionhover:bg-gray-100 hover:rounded-lg pt-0"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="pt-0">☰</span>
        </button>

        <nav className="hidden sm:flex gap-6">
          <a href="/login" className="hover:text-blue-600">
            Login
          </a>
          <a href="#about" className="hover:text-blue-600">
            About Us
          </a>
          <a href="#contacts" className="hover:text-blue-600">
            Contacts
          </a>
          <a href="#how" className="hover:text-blue-600">
            How it works
          </a>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col sm:hidden p-4 bg-white shadow gap-4">
          <a href="/login" className="hover:text-blue-600">
            Login
          </a>
          <a href="#about" className="hover:text-blue-600">
            About Us
          </a>
          <a href="#contacts" className="hover:text-blue-600">
            Contacts
          </a>
          <a href="#how" className="hover:text-blue-600">
            How it works
          </a>
        </div>
      )}

      <main className="flex-1 p-4">{children}</main>

      <footer className="p-4 bg-gray-100 text-center text-sm">
        &copy; {new Date().getFullYear()} SmartManagement
      </footer>
    </div>
  )
}
