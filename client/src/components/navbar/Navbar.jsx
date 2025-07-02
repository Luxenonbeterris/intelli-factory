import { useRef, useState } from 'react'
import MobileMenu from './MobileMenu'
import NavLinks from './NavLinks'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  return (
    <nav className="bg-white shadow-md">
      <div className="w-full flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-blue-600">My Portfolio</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 cursor-pointer">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100 cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        menuRef={menuRef}
        excludeRef={buttonRef}
      />
    </nav>
  )
}
