import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ApiService } from '../ApiService/Apiservice'
import type { User } from '../ApiService/types'

interface AuthContextType {
  api: ApiService
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [api] = useState(() => new ApiService())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const userData = await api.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          api.logout()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [api])

  const logout = () => {
    api.logout()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ api, user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
