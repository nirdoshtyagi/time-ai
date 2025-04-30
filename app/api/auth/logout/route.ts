import { NextResponse } from "next/server"
import { logout } from "@/lib/actions/auth-actions"

export async function POST() {
  try {
    await logout()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
