import { type NextRequest, NextResponse } from "next/server"
import { getAIAdoptionData } from "@/lib/actions/report-actions"

export async function GET(request: NextRequest) {
  try {
    const aiAdoptionData = await getAIAdoptionData()
    return NextResponse.json(aiAdoptionData)
  } catch (error) {
    console.error("Error in GET /api/reports/ai-adoption:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch AI adoption data" }, { status: 500 })
  }
}
