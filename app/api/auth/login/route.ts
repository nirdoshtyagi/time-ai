import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/actions/auth-actions"
import { ensureDatabaseInitialized } from "@/lib/db-init"

export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await ensureDatabaseInitialized()

    const { email, password } = await request.json()
    const result = await login(email, password)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
