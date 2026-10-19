import { createContext, useContext } from 'react'
import type { User, UserCredentials } from '../types/userTypes'

type AuthContextType = {
  user: User | null
  login: (credentials: UserCredentials) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  loginError: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth kan inte användas utanför AuthProvider')
  }
  return context
}
