'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useConvexTest } from '@/hooks/useConvexTest'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { initializeDatabase } = useConvexTest()
  const [isInitializing, setIsInitializing] = useState(false)
  const [initResult, setInitResult] = useState<string | null>(null)

  // Reindirizza alla dashboard se autenticato
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const handleInitialize = async () => {
    setIsInitializing(true)
    setInitResult(null)
    
    try {
      const result = await initializeDatabase()
      setInitResult(`✅ Database inizializzato: ${JSON.stringify(result.data)}`)
    } catch (error) {
      setInitResult(`❌ Errore: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsInitializing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Healthcare Ticket System</CardTitle>
          <CardDescription>
            Sistema di gestione ticket per cliniche sanitarie
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ Next.js configurato</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ Tailwind CSS configurato</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ Convex configurato</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ Schema database implementato</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800 text-sm">✅ Auth0 configurato</p>
            </div>
          </div>
          
          <div className="pt-4 border-t space-y-4">
            <Button
              onClick={handleInitialize}
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? 'Inizializzando...' : 'Inizializza Database'}
            </Button>
            
            <a href="/api/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                Accedi al Sistema
              </Button>
            </a>
            
            {initResult && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{initResult}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}