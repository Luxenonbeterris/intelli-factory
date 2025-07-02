import { useClickOutside } from '../../hooks/useClickOutside'
import NavLinks from './NavLinks'

export default function MobileMenu({ isOpen, onClose, menuRef, excludeRef }) {
  useClickOutside(onClose, [menuRef, excludeRef])

  if (!isOpen) return null

  return (
    <div ref={menuRef} className="md:hidden px-4 pb-4 flex flex-col gap-2 cursor-pointer shadow-md">
      <NavLinks onClick={onClose} />
    </div>
  )
}
