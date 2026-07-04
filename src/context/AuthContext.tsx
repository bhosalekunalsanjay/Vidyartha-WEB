import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios.instance.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // On app load, check if we have a token and try to restore the session.
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setIsLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('accessToken'))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email:string, password:string) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('accessToken', res.data.accessToken)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook so components never import AuthContext directly.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}