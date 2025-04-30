import { type NextRequest, NextResponse } from "next/server"
import { getEmployees, addEmployee } from "@/lib/actions/employee-actions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || ""
    const status = searchParams.get("status") || ""
    const role = searchParams.get("role") || ""

    const query: any = {}
    if (search) query.search = search
    if (department && department !== "all") query.department = department
    if (status && status !== "all") query.status = status
    if (role) query.role = role

    const employees = await getEmployees(search, department, status)
    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error in GET /api/employees:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json()
    const result = await addEmployee(employeeData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/employees:", error)
    return NextResponse.json({ success: false, message: "Failed to add employee" }, { status: 500 })
  }
}
