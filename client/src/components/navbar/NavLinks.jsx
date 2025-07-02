import { Link } from 'react-router-dom'
import useNavRoutes from '../../hooks/useNavRoutes'

export default function NavLinks({ onClick, className = '' }) {
  const navRoutes = useNavRoutes()

  return (
    <>
      {navRoutes.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          onClick={onClick}
          className={`text-xl font-medium text-gray-800 hover:text-blue-500 pl-2 pb-2 sm:pl-0 sm:pb-0 ${className}`}
        >
          {label}
        </Link>
      ))}
    </>
  )
}
