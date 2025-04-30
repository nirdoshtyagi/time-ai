import { type NextRequest, NextResponse } from "next/server"
import { getDepartments } from "@/lib/actions/employee-actions"

export async function GET(request: NextRequest) {
  try {
    const departments = await getDepartments()
    return NextResponse.json(departments)
  } catch (error) {
    console.error("Error in GET /api/departments:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch departments" }, { status: 500 })
  }
}
