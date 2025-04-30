import { type NextRequest, NextResponse } from "next/server"
import { getProjects, addProject } from "@/lib/actions/project-actions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || ""
    const status = searchParams.get("status") || ""

    const projects = await getProjects(search, department, status)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error in GET /api/projects:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()
    const result = await addProject(projectData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/projects:", error)
    return NextResponse.json({ success: false, message: "Failed to add project" }, { status: 500 })
  }
}
