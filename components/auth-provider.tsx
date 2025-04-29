"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth, type User, type UserRole } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, login, logout } = useAuth()

  const hasPermission = (permission: string) => {
    if (!user) return false

    // This is a simplified permission check
    // In a real app, you would have a more sophisticated permission system
    const roleAccessLevels: Record<UserRole, number> = {
      super_admin: 100,
      admin: 80,
      manager: 60,
      employee: 40,
    }

    const requiredLevel =
      {
        manage_employees: 80,
        manage_projects: 60,
        manage_tasks: 60,
        manage_settings: 100,
        view_reports: 80,
        view_ai_adoption: 60,
      }[permission] || 100

    return roleAccessLevels[user.role] >= requiredLevel
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
