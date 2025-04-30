import { type NextRequest, NextResponse } from "next/server"
import { updateTask, deleteTask } from "@/lib/actions/task-actions"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskData = await request.json()
    const result = await updateTask(params.id, taskData)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in PUT /api/tasks/${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteTask(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in DELETE /api/tasks/${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Failed to delete task" }, { status: 500 })
  }
}
