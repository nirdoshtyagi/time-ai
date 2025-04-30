"use server"

import { cookies } from "next/headers"
import { findOne, Collections } from "../db-service"
import type { User } from "../models"

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; message?: string; user?: any }> {
  try {
    // Find the user with the provided email
    const user = await findOne(Collections.USERS, { email })

    // Check if user exists and password matches
    if (user && user.password === password) {
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user

      // Store user info in a cookie
      cookies().set("user", JSON.stringify(userWithoutPassword), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return { success: true, user: userWithoutPassword }
    }

    return {
      success: false,
      message: "Invalid email or password. Please try again.",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function logout() {
  cookies().delete("user")
  return { success: true }
}

export async function getCurrentUser(): Promise<User | null> {
  const userCookie = cookies().get("user")
  if (!userCookie) return null

  try {
    return JSON.parse(userCookie.value)
  } catch (error) {
    return null
  }
}
