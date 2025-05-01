"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { hasRouteAccess } from "@/lib/auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // If authenticated but doesn't have access to this route, redirect to dashboard
    if (user && !hasRouteAccess(user, pathname)) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router, pathname])

  // If not authenticated or doesn't have access, don't render children
  if (!isAuthenticated || (user && !hasRouteAccess(user, pathname))) {
    return null
  }

  return <>{children}</>
}
