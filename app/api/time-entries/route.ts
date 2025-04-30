import { type NextRequest, NextResponse } from "next/server"
import { getTimeEntries, addTimeEntry } from "@/lib/actions/time-actions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const employee = searchParams.get("employee") || ""
    const project = searchParams.get("project") || ""

    // Parse date range if provided
    let dateRange = {}
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    if (from && to) {
      dateRange = { from, to }
    }

    const timeEntries = await getTimeEntries(search, employee, project, dateRange)
    return NextResponse.json(timeEntries)
  } catch (error) {
    console.error("Error in GET /api/time-entries:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch time entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const timeEntryData = await request.json()
    const result = await addTimeEntry(timeEntryData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/time-entries:", error)
    return NextResponse.json({ success: false, message: "Failed to add time entry" }, { status: 500 })
  }
}
