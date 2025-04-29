// This is a simplified auth implementation for demonstration
// In a real application, you would use NextAuth.js, Clerk, or another auth provider

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "super_admin" | "admin" | "manager" | "employee"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department?: string
  managerId?: string
}

// Super admin credentials
export const SUPER_ADMIN_EMAIL = "nirdosh.tyagi@techmagnate.com"
export const SUPER_ADMIN_PASSWORD = "admin@123"

// Mock users for demonstration
export const users = [
  {
    id: "user_1",
    name: "Admin",
    email: SUPER_ADMIN_EMAIL,
    password: SUPER_ADMIN_PASSWORD,
    role: "super_admin" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Management",
  },
  {
    id: "user_2",
    name: "Admin User",
    email: "admin@techmagnate.com",
    password: "Admin123!",
    role: "admin" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Management",
    managerId: "user_1",
  },
  {
    id: "user_3",
    name: "Manager User",
    email: "manager@techmagnate.com",
    password: "Manager123!",
    role: "manager" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Engineering",
    managerId: "user_2",
  },
  {
    id: "user_4",
    name: "Employee User",
    email: "employee@techmagnate.com",
    password: "Employee123!",
    role: "employee" as UserRole,
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Engineering",
    managerId: "user_3",
  },
]

// Define the auth store type
interface AuthState {
  user: User | null
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
        // Find the user with the provided email
        const user = users.find((u) => u.email === email)

        // Check if user exists and password matches
        if (user && user.password === password) {
          // Remove password from user object before storing
          const { password: _, ...userWithoutPassword } = user

          set({ user: userWithoutPassword, isAuthenticated: true })
          return { success: true }
        }

        return {
          success: false,
          message: "Invalid email or password. Please try again.",
        }
      },
      logout: () => {
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
export function hasRouteAccess(user: User | null, route: string): boolean {
  if (!user) return false

  const permissions = rolePermissions[user.role]
  return permissions.routes.includes(route)
}

// Helper function to check if a user has a specific permission
export function hasPermission(user: User | null, permission: keyof typeof rolePermissions.super_admin): boolean {
  if (!user) return false

  const permissions = rolePermissions[user.role]
  return !!permissions[permission]
}

// Helper function to get all users in a user's hierarchy
export function getUserHierarchy(userId: string): User[] {
  const user = users.find((u) => u.id === userId)
  if (!user) return []

  // For super_admin and admin, return all users
  if (user.role === "super_admin" || user.role === "admin") {
    return users.map(({ password: _, ...userWithoutPassword }) => userWithoutPassword)
  }

  // For managers, return self and all users that report to them
  if (user.role === "manager") {
    return users
      .filter((u) => u.id === userId || u.managerId === userId)
      .map(({ password: _, ...userWithoutPassword }) => userWithoutPassword)
  }

  // For employees, return only self
  return users.filter((u) => u.id === userId).map(({ password: _, ...userWithoutPassword }) => userWithoutPassword)
}
