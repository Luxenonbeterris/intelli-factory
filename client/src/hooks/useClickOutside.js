import { useEffect } from 'react'

export function useClickOutside(handler, refs = []) {
  useEffect(() => {
    function handleClick(event) {
      const clickedOutside = refs.every((ref) => ref.current && !ref.current.contains(event.target))
      if (clickedOutside) handler()
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [handler, refs])
}
