import { type NextRequest, NextResponse } from "next/server"
import { getTasks, addTask } from "@/lib/actions/task-actions"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const project = searchParams.get("project") || ""
    const subProject = searchParams.get("subProject") || ""
    const status = searchParams.get("status") || ""

    const tasks = await getTasks(search, project, subProject, status)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error in GET /api/tasks:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json()
    const result = await addTask(taskData)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/tasks:", error)
    return NextResponse.json({ success: false, message: "Failed to add task" }, { status: 500 })
  }
}
