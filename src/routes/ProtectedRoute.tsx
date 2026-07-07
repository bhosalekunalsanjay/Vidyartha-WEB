import { Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <div>Checking your session...</div>
  }

  return <Outlet />
}