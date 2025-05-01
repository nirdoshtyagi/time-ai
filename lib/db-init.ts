import { initializeApp } from "./init-db"

// Initialize the database when this module is imported
let initPromise: Promise<{ success: boolean; error?: any }> | null = null

export function getInitPromise() {
  if (!initPromise) {
    initPromise = initializeApp()
  }
  return initPromise
}

// Export a function to ensure the database is initialized
export async function ensureDatabaseInitialized() {
  const result = await getInitPromise()
  if (!result.success) {
    console.error("Database initialization failed:", result.error)
  }
  return result.success
}
