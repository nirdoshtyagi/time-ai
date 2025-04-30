// This file serves as a client-side wrapper around our server actions

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define the auth store type
interface AuthState {
  user: any | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

// Create the auth store with persistence
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          // Call the server action
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          })

          const result = await response.json()

          if (result.success) {
            set({ user: result.user, isAuthenticated: true })
            return { success: true }
          }

          return {
            success: false,
            message: result.message || "Invalid email or password. Please try again.",
          }
        } catch (error) {
          console.error("Login error:", error)
          return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
          }
        }
      },
      logout: async () => {
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
          })
        } catch (error) {
          console.error("Logout error:", error)
        }
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Role-based access control
export const rolePermissions = {
  super_admin: {
    accessLevel: 100,
    routes: [
      "/dashboard",
      "/dashboard/employees",
      "/dashboard/projects",
      "/dashboard/tasks",
      "/dashboard/time-tracking",
      "/dashboard/ai-adoption",
      "/dashboard/reports",
      "/dashboard/settings",
    ],
    canCreateEmployee: true,
    canEditEmployee: true,
    canDeleteEmployee: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canManageSettings: true,
    canEditDepartments: true,
  },
  admin: {
    accessLevel: 80,
    routes: [
      "/dashboard",
      "/dashboard/employees",
      "/dashboard/projects",
      "/dashboard/tasks",
      "/dashboard/time-tracking",
      "/dashboard/ai-adoption",
      "/dashboard/reports",
    ],
    canCreateEmployee: true,
    canEditEmployee: true,
    canDeleteEmployee: false,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canManageSettings: false,
    canEditDepartments: false,
  },
  manager: {
    accessLevel: 60,
    routes: [
      "/dashboard",
      "/dashboard/employees",
      "/dashboard/projects",
      "/dashboard/tasks",
      "/dashboard/time-tracking",
      "/dashboard/ai-adoption",
    ],
    canCreateEmployee: false,
    canEditEmployee: false,
    canDeleteEmployee: false,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canManageSettings: false,
    canEditDepartments: false,
  },
  employee: {
    accessLevel: 40,
    routes: ["/dashboard", "/dashboard/tasks", "/dashboard/time-tracking"],
    canCreateEmployee: false,
    canEditEmployee: false,
    canDeleteEmployee: false,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canCreateTask: false,
    canEditTask: true,
    canDeleteTask: false,
    canManageSettings: false,
    canEditDepartments: false,
  },
}

// Helper function to check if a user has access to a specific route
export function hasRouteAccess(user: any | null, route: string): boolean {
  if (!user) return false

  const permissions = rolePermissions[user.role as UserRole]
  return permissions.routes.includes(route)
}

// Helper function to check if a user has a specific permission
export function hasPermission(user: any | null, permission: keyof typeof rolePermissions.super_admin): boolean {
  if (!user) return false

  const permissions = rolePermissions[user.role as UserRole]
  return !!permissions[permission]
}

// Super admin credentials
export const SUPER_ADMIN_EMAIL = "nirdosh.tyagi@techmagnate.com"
export const SUPER_ADMIN_PASSWORD = "tyagi321"

export type UserRole = "super_admin" | "admin" | "manager" | "employee"

export interface User {
  _id?: any
  name: string
  email: string
  password: string
  role: UserRole
  avatar?: string
  department?: string
  managerId?: string
  createdAt?: Date
  updatedAt?: Date
}
