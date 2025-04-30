import { type NextRequest, NextResponse } from "next/server"
import { getPerformanceData } from "@/lib/actions/report-actions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const department = searchParams.get("department") || ""

    // Parse date range if provided
    let dateRange = {}
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    if (from && to) {
      dateRange = { from, to }
    }

    const performanceData = await getPerformanceData(department, dateRange)
    return NextResponse.json(performanceData)
  } catch (error) {
    console.error("Error in GET /api/reports/performance:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch performance data" }, { status: 500 })
  }
}
