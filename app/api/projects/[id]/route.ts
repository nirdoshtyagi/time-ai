import { type NextRequest, NextResponse } from "next/server"
import { updateProject, deleteProject } from "@/lib/actions/project-actions"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectData = await request.json()
    const result = await updateProject(params.id, projectData)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in PUT /api/projects/${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteProject(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in DELETE /api/projects/${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Failed to delete project" }, { status: 500 })
  }
}
