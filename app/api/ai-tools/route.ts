import { type NextRequest, NextResponse } from "next/server"
import { Collections, find } from "@/lib/db-service"

export async function GET(request: NextRequest) {
  try {
    const aiTools = await find(Collections.AI_TOOLS)
    return NextResponse.json(aiTools)
  } catch (error) {
    console.error("Error in GET /api/ai-tools:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch AI tools" }, { status: 500 })
  }
}
