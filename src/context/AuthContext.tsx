import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../api/axiosClient.ts'
import type { User } from '../interfaces/user.type.ts'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string, terminateTokenId?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On app load, check if we have a token and try to restore the session.
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setIsLoading(false)
      return
    }
    api
      .get<User>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (username: string, password: string, terminateTokenId?: string) => {
    const res = await api.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
      username,
      password,
      deviceInfo: window.navigator.userAgent,
      terminateTokenId,
    })
    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    setUser(res.data.user)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Failed to log out from server', err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
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