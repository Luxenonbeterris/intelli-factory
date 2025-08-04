import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="flex justify-between items-center py-2 px-4 shadow bg-white">
        <h1 className="text-xl font-bold text-blue-800">SmartManagement</h1>
        <button
          className="sm:hidden text-3xl cursor-pointer flex items-center justify-center w-12 h-12 transitionhover:bg-gray-100 hover:rounded-lg pt-0"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="pt-0">☰</span>
        </button>

        <nav className="hidden sm:flex gap-6 items-center">
          <a href="/login" className="hover:text-blue-600">
            {t('layout.login')}
          </a>
          <a href="#about" className="hover:text-blue-600">
            {t('layout.about')}
          </a>
          <a href="#contacts" className="hover:text-blue-600">
            {t('layout.contacts')}
          </a>
          <a href="#how" className="hover:text-blue-600">
            {t('layout.how')}
          </a>
          <LanguageSwitcher />
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col sm:hidden p-4 bg-white shadow gap-4">
          <a href="/login" className="hover:text-blue-600">
            {t('layout.login')}
          </a>
          <a href="#about" className="hover:text-blue-600">
            {t('layout.about')}
          </a>
          <a href="#contacts" className="hover:text-blue-600">
            {t('layout.contacts')}
          </a>
          <a href="#how" className="hover:text-blue-600">
            {t('layout.how')}
          </a>
          <LanguageSwitcher />
        </div>
      )}

      <main className="flex-1 ">{children}</main>

      <footer className="p-4 bg-gray-100 text-center text-sm">
        &copy; {new Date().getFullYear()} SmartManagement
      </footer>
    </div>
  )
}
