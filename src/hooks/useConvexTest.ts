import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

export function useConvexTest() {
  const initializeDatabase = useMutation(api.init.initializeDatabase)
  const resetDatabase = useMutation(api.init.resetDatabase)
  
  return {
    initializeDatabase,
    resetDatabase,
  }
}