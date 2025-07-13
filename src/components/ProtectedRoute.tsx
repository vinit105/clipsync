// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import type { User } from 'firebase/auth'

const ProtectedRoute = ({
  user,
  children,
}: {
  user: User | null
  children: React.ReactNode
}) => {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
