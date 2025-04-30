import { type NextRequest, NextResponse } from "next/server"
import { getProjectStatusData } from "@/lib/actions/report-actions"

export async function GET(request: NextRequest) {
  try {
    const projectStatusData = await getProjectStatusData()
    return NextResponse.json(projectStatusData)
  } catch (error) {
    console.error("Error in GET /api/reports/project-status:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch project status data" }, { status: 500 })
  }
}
