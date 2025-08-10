// client/src/components/Button.tsx
import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  href?: string
}

export const Button = ({ children, onClick, className, href }: ButtonProps) => {
  const baseClass = `
    flex items-center justify-center
    h-10 px-4 text-base font-semibold
    rounded-md transition
    hover:bg-gray-100 hover:rounded-lg
    cursor-pointer
    ${className || ''}
  `

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {children}
    </button>
  )
}
