'use client'

import { useState, useEffect } from 'react'

// Mock authentication per testing UI
export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Mock user data
  const mockUser = {
    id: 'mock-user-1',
    email: 'mario.rossi@clinica.it',
    name: 'Dr. Mario Rossi',
    clinic: 'Clinica San Giuseppe',
    role: 'agent'
  }

  useEffect(() => {
    // Simula caricamento autenticazione
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Per ora sempre autenticato per testare l'UI
      setIsAuthenticated(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return {
    user: isAuthenticated ? mockUser : null,
    isAuthenticated,
    isLoading,
    error: null,
  }
}

export function usePermissions() {
  return {
    checkPermission: (_resource: string, _action: string, _targetId?: string) => {
      // Per ora ritorna sempre true per testare l'UI
      return true
    }
  }
}