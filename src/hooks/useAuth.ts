'use client'

import { useAuth as useAuthContext } from '@/providers/AuthProvider'

// Re-export del hook dall'AuthProvider
export function useAuth() {
  return useAuthContext()
}

export function usePermissions() {
  const { user } = useAuth()
  
  return {
    checkPermission: (resource: string, action: string, targetId?: string) => {
      if (!user) return false
      
      const permissions = user.roleDetails?.permissions || []
      
      // Logica di controllo permessi semplificata
      switch (user.role) {
        case 'admin':
          return true // Admin può fare tutto
        case 'agent':
          return permissions.some(p => 
            p.includes('clinic:') || 
            p.includes('tickets:') ||
            (p.includes('own:') && targetId === user.id)
          )
        case 'user':
          return permissions.some(p => 
            p.includes('own:') && targetId === user.id ||
            p.includes('tickets:create')
          )
        default:
          return false
      }
    },
    
    canAccess: (area: 'dashboard' | 'tickets' | 'users' | 'settings') => {
      if (!user) return false
      
      switch (user.role) {
        case 'admin':
          return true
        case 'agent':
          return ['dashboard', 'tickets'].includes(area)
        case 'user':
          return ['dashboard', 'tickets'].includes(area)
        default:
          return false
      }
    }
  }
}