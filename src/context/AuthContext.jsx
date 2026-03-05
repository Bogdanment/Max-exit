import React, { createContext, useState, useEffect, useContext } from 'react'
import { api } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Загрузить сохраненного пользователя при загрузке
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
          setToken(savedToken)
          const userData = await api.auth.getMe()
          setUser(userData)
        }
      } catch (err) {
        console.error('Failed to load user:', err)
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const register = async (email, password, name) => {
    try {
      setError(null)
      const response = await api.auth.register(email, password, name)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      return response.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.auth.login(email, password)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      return response.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const value = {
    user,
    token,
    isLoading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
