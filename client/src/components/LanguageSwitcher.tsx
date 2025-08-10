// client/src/components/LanguageSwitcher.tsx
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClickOutside } from '../hooks/useClickOutside'

const LANGUAGES = [
  { code: 'ru', label: '🇷🇺 Рус' },
  { code: 'en', label: '🇬🇧 Eng' },
  { code: 'zh', label: '🇨🇳 中文' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(
    ref as React.RefObject<HTMLElement>,
    useCallback(() => setOpen(false), [])
  )

  const current = LANGUAGES.find(({ code }) => code === i18n.language) ?? LANGUAGES[0]

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center justify-between w-24 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-blue-100 hover:text-blue-700 transition cursor-pointer"
      >
        <span>{current.label}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute z-11 mt-1 w-24 bg-white border border-gray-300 rounded shadow-md"
          role="menu"
        >
          {LANGUAGES.map(({ code, label }) => (
            <li key={code} role="none">
              <button
                type="button"
                onClick={() => {
                  i18n.changeLanguage(code)
                  setOpen(false)
                }}
                role="menuitem"
                tabIndex={0}
                className={`w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 ${
                  i18n.language === code ? 'font-semibold bg-blue-50' : ''
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
