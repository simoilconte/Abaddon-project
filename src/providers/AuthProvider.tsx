'use client'

import { ReactNode } from 'react'

// Mock AuthProvider per testing UI
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}