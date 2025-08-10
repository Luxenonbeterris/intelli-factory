// client/src/components/MenuToggle.tsx
import { Button } from './Button'

type MenuToggleProps = {
  onClick: () => void
}

export const MenuToggle = ({ onClick }: MenuToggleProps) => (
  <Button onClick={onClick} className="sm:hidden text-3xl leading-none">
    <span className="translate-y-[1px] inline-block">☰</span>
  </Button>
)
