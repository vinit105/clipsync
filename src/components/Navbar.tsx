import { useLocation, useNavigate } from 'react-router-dom'
import type { User } from 'firebase/auth'
import { logoutUser } from '../services/authServices'

interface VerticalNavbarProps {
  User: User | null
}

const VerticalNavbar = ({ User }: VerticalNavbarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const getButtonClass = (path: string) =>
    `mb-10 -rotate-90 ${
      location.pathname === path ? 'text-cyan-400' : 'text-white'
    } transition-all font-medium tracking-wide whitespace-nowrap`

  return (
    <div className="fixed top-0 left-0 h-full w-8 bg-gray-900 flex flex-col items-center py-6 shadow-lg z-50 place-content-evenly">
      {/* Login or Logout */}
      {User ? (
        <button
          onClick={async () => {
            await logoutUser()
            navigate('/login')
          }}
          className={getButtonClass('/login')}
        >
          LogOut
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className={getButtonClass('/login')}
        >
          Login
        </button>
      )}

      {/* Dashboard */}
      {User && (
        <button
          onClick={() => navigate('/dashboard')}
          className={getButtonClass('/dashboard')}
        >
          Dashboard
        </button>
      )}

      {/* About */}
      <button
        onClick={() => navigate('/about')}
        className={getButtonClass('/about')}
      >
        About Us
      </button>
    </div>
  )
}

export default VerticalNavbar
