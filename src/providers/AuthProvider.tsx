'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

interface AuthContextType {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: auth0User, error: auth0Error, isLoading: auth0Loading } = useUser()
  const [convexUser, setConvexUser] = useState<any | null>(null)
  const [syncing, setSyncing] = useState(false)

  const getOrCreateUser = useMutation(api.auth.getOrCreateUser)

  useEffect(() => {
    const syncUser = async () => {
      if (!auth0User || !auth0User.sub || !auth0User.email) {
        setConvexUser(null)
        return
      }
      try {
        setSyncing(true)
        const user = await getOrCreateUser({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          name: auth0User.name || auth0User.email,
        })
        setConvexUser(user)
      } catch (err) {
        console.error('Error syncing user with Convex', err)
      } finally {
        setSyncing(false)
      }
    }

    void syncUser()
  }, [auth0User, getOrCreateUser])

  const value: AuthContextType = {
    user: convexUser,
    isAuthenticated: !!auth0User && !!convexUser,
    isLoading: auth0Loading || syncing,
    error: auth0Error?.message || null,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}