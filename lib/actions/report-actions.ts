"use server"

import { connectToDatabase } from "../mongodb"
import { TimeEntry, Task, Project, Employee, Department, AITool } from "../models"

export async function getPerformanceData(startDate?: string, endDate?: string, departmentId?: string) {
  try {
    await connectToDatabase()

    const matchStage: any = {}

    if (startDate && endDate) {
      matchStage.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    // Get all time entries
    const timeEntries = await TimeEntry.find(matchStage).lean()

    // Get all employees
    const employees = await Employee.find({}).lean()

    // Get all departments
    const departments = await Department.find({}).lean()

    // Calculate performance metrics
    const employeePerformance = employees.map((employee) => {
      const employeeTimeEntries = timeEntries.filter((entry) => entry.employeeId.toString() === employee._id.toString())

      const totalHours = employeeTimeEntries.reduce((sum, entry) => sum + entry.hours, 0)

      const department = departments.find((dept) => dept._id.toString() === employee.departmentId?.toString())

      return {
        id: employee._id.toString(),
        name: `${employee.firstName} ${employee.lastName}`,
        department: department?.name || "Unassigned",
        departmentId: department?._id.toString() || "",
        totalHours,
        productivity: Math.min((totalHours / 40) * 100, 100), // Assuming 40 hours is 100% productivity
      }
    })

    // Filter by department if specified
    const filteredPerformance = departmentId
      ? employeePerformance.filter((emp) => emp.departmentId === departmentId)
      : employeePerformance

    return filteredPerformance
  } catch (error) {
    console.error("Error getting performance data:", error)
    throw error
  }
}

export async function getAIAdoptionData() {
  try {
    await connectToDatabase()

    // Get all AI tools
    const aiTools = await AITool.find({}).lean()

    // Get all time entries with AI tool usage
    const timeEntries = await TimeEntry.find({ aiToolId: { $exists: true, $ne: null } }).lean()

    // Get all employees
    const employees = await Employee.find({}).lean()

    // Calculate AI adoption metrics
    const aiAdoption = aiTools.map((tool) => {
      const toolTimeEntries = timeEntries.filter(
        (entry) => entry.aiToolId && entry.aiToolId.toString() === tool._id.toString(),
      )

      const totalHours = toolTimeEntries.reduce((sum, entry) => sum + entry.hours, 0)

      const uniqueUsers = new Set(toolTimeEntries.map((entry) => entry.employeeId.toString())).size

      return {
        id: tool._id.toString(),
        name: tool.name,
        totalHours,
        uniqueUsers,
        adoptionRate: (uniqueUsers / employees.length) * 100,
      }
    })

    return aiAdoption
  } catch (error) {
    console.error("Error getting AI adoption data:", error)
    throw error
  }
}

export async function getProjectStatusData() {
  try {
    await connectToDatabase()

    // Get all projects
    const projects = await Project.find({}).lean()

    // Get all tasks
    const tasks = await Task.find({}).lean()

    // Calculate project status metrics
    const projectStatus = projects.map((project) => {
      const projectTasks = tasks.filter((task) => task.projectId.toString() === project._id.toString())

      const totalTasks = projectTasks.length
      const completedTasks = projectTasks.filter((task) => task.status === "Completed").length
      const inProgressTasks = projectTasks.filter((task) => task.status === "In Progress").length
      const pendingTasks = projectTasks.filter((task) => task.status === "Pending").length

      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

      return {
        id: project._id.toString(),
        name: project.name,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        progress,
      }
    })

    return projectStatus
  } catch (error) {
    console.error("Error getting project status data:", error)
    throw error
  }
}
