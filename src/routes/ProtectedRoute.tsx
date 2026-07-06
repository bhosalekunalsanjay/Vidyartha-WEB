import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Checking your session...</div>
  }

  if (!user) {
    // Remember where they were headed so we can send them back after login.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}