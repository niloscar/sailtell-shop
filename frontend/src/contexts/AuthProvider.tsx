import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import type { ReactNode } from 'react'
import type { User, UserCredentials } from '@shop/shared'
import { loginUser, logoutUser, getSession } from '../api/authApi'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await getSession()
        setUser(user)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (credentials: UserCredentials): Promise<User | null> => {
    const { email, password } = credentials

    setLoginError(null)

    if (!email.trim() || !password.trim()) {
      setLoginError('E-post och lösenord måste fyllas i.')
      return null
    }

    try {
      const { user } = await loginUser({
        email: email.trim(),
        password: password.trim()
      })

      setUser(user)

      return user
    } catch {
      setUser(null)
      setLoginError('Felaktig e-post eller lösenord.')

      return null
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } finally {
      setUser(null)
      setLoginError(null)
    }
  }

  const isAuthenticated = user !== null

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    loginError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
