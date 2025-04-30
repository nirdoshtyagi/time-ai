import { type NextRequest, NextResponse } from "next/server"
import { updateEmployee, deleteEmployee } from "@/lib/actions/employee-actions"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const employeeData = await request.json()
    const result = await updateEmployee(params.id, employeeData)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in PUT /api/employees/${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteEmployee(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error in DELETE /api/employees/${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Failed to delete employee" }, { status: 500 })
  }
}
