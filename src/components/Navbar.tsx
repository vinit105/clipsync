import { useNavigate } from 'react-router-dom'
import type { User } from 'firebase/auth'
import { logoutUser } from '../services/authServices'

interface VerticalNavbarProps {
  User: User | null
}

const VerticalNavbar = ({ User }: VerticalNavbarProps) => {
  const navigate = useNavigate()

  return (
    <div className="fixed top-0 left-0 h-full w-8 bg-gray-900 flex flex-col items-center py-6 shadow-lg z-50 place-content-evenly">
      {/* Login or Logout */}
      {User ? (
        <button
          onClick={async () => {
            await logoutUser()
            navigate('/login')
          }}
          className="mb-10 -rotate-90 text-white hover:text-cyan-400 transition-all font-medium tracking-wide whitespace-nowrap"
        >
          LogOut
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="mb-10 -rotate-90 text-white hover:text-cyan-400 transition-all font-medium tracking-wide whitespace-nowrap"
        >
          Login
        </button>
      )}

      {/* Dashboard */}
      {User && (
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-10 -rotate-90 text-white hover:text-cyan-400 transition-all font-medium tracking-wide whitespace-nowrap"
        >
          Dashboard
        </button>
      )}

      {/* About */}
      <button
        onClick={() => navigate('/about')}
        className="mb-10 -rotate-90 text-white hover:text-cyan-400 transition-all font-medium tracking-wide whitespace-nowrap"
      >
        About Us
      </button>
    </div>
  )
}

export default VerticalNavbar
