"use server"

import { Collections, find, getUserHierarchy } from "../db-service"
import { getCurrentUser } from "./auth-actions"

export async function getPerformanceData(departmentFilter = "", dateRange = {}) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Build query for tasks
    const taskQuery: any = {}
    const timeEntryQuery: any = {}

    let users: any[] = [] // Declare users variable
    let hierarchyUsers: any[] = [] // Declare hierarchyUsers variable

    if (departmentFilter && departmentFilter !== "all") {
      // We need to get users from this department first
      users = await find(Collections.USERS, { department: departmentFilter })
      const userIds = users.map((user) => user._id.toString())

      taskQuery.assignedTo = { $in: userIds }
      timeEntryQuery.userId = { $in: userIds }
    }

    if (dateRange && dateRange.from && dateRange.to) {
      timeEntryQuery.date = {
        $gte: new Date(dateRange.from),
        $lte: new Date(dateRange.to),
      }
    }

    // For non-admin users, only show data from their hierarchy
    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      hierarchyUsers = await getUserHierarchy(currentUser._id.toString())
      const hierarchyUserIds = hierarchyUsers.map((user) => user._id.toString())

      taskQuery.assignedTo = { $in: hierarchyUserIds }
      timeEntryQuery.userId = { $in: hierarchyUserIds }
    }

    // Get tasks and time entries
    const tasks = await find(Collections.TASKS, taskQuery)
    const timeEntries = await find(Collections.TIME_ENTRIES, timeEntryQuery)

    // Get all departments
    const departments = await find(Collections.DEPARTMENTS)

    // Calculate performance metrics by department
    const performanceData = departments.map((dept) => {
      // Get users in this department
      const deptUsers =
        currentUser.role === "super_admin" || currentUser.role === "admin"
          ? users.filter((user) => user.department === dept.name)
          : hierarchyUsers.filter((user) => user.department === dept.name)

      const deptUserIds = deptUsers.map((user) => user._id.toString())

      // Get tasks for these users
      const deptTasks = tasks.filter((task) => deptUserIds.includes(task.assignedTo))
      const completedTasks = deptTasks.filter((task) => task.status === "Completed")

      // Get time entries for these users
      const deptTimeEntries = timeEntries.filter((entry) => deptUserIds.includes(entry.userId))

      // Calculate metrics
      const tasksCompleted = completedTasks.length

      // Time efficiency: actual time vs estimated time (lower is better)
      const totalEstimatedTime = deptTasks.reduce((sum, task) => sum + task.estimatedTime, 0)
      const totalActualTime = deptTimeEntries.reduce((sum, entry) => sum + entry.timeSpent, 0)
      const timeEfficiency =
        totalEstimatedTime > 0 ? Math.min(100, Math.round((totalEstimatedTime / (totalActualTime || 1)) * 100)) : 0

      // AI usage percentage
      const aiEntries = deptTimeEntries.filter((entry) => entry.aiUsed)
      const aiUsage = deptTimeEntries.length > 0 ? Math.round((aiEntries.length / deptTimeEntries.length) * 100) : 0

      return {
        name: dept.name,
        "Tasks Completed": tasksCompleted,
        "Time Efficiency": timeEfficiency,
        "AI Usage": aiUsage,
      }
    })

    return performanceData
  } catch (error) {
    console.error("Error fetching performance data:", error)
    throw new Error("Failed to fetch performance data")
  }
}

export async function getAIAdoptionData() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Get all departments
    const departments = await find(Collections.DEPARTMENTS)

    // Get all time entries
    const timeEntryQuery: any = {}

    // For non-admin users, only show data from their hierarchy
    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      const hierarchyUsers = await getUserHierarchy(currentUser._id.toString())
      const hierarchyUserIds = hierarchyUsers.map((user) => user._id.toString())

      timeEntryQuery.userId = { $in: hierarchyUserIds }
    }

    const timeEntries = await find(Collections.TIME_ENTRIES, timeEntryQuery)

    // Calculate AI adoption metrics by department
    const aiAdoptionData = await Promise.all(departments.map(async dept => {
      // Get users in this department
      const deptUsers = await find(Collections.USERS, { department: dept.name })
      const deptUserIds = deptUsers.map(user => user._id.toString())
      
      // Get time entries for these users
      const deptTimeEntries = timeEntries.filter(entry => deptUserIds.includes(entry.userId))
      const aiEntries = deptTimeEntries.filter(entry => entry.aiUsed)
      
      // Calculate AI adoption rate
      const aiAdoptionRate = deptTimeEntries.length > 0
        ? Math.round((aiEntries.length / deptTimeEntries.length) * 100)
        : 0
      
      return {
        name: dept.name,
        value: aiAdoptionRate,
        color: getColorForDepartment(dept.name)
      }
    })
    \
    return aiAdoptionData
  } catch (error) {
    console.error("Error fetching AI adoption data:", error)
    throw new Error("Failed to fetch AI adoption data")
  }
}

// Helper function to get consistent colors for departments
function getColorForDepartment(department: string) {
  const colorMap: Record<string, string> = {
    Engineering: "#4f46e5",
    Marketing: "#06b6d4",
    Design: "#f59e0b",
    Product: "#10b981",
    HR: "#ef4444",
    IT: "#8b5cf6",
    Finance: "#ec4899",
    Sales: "#14b8a6",
  }

  return colorMap[department] || "#6b7280" // Default gray color
}

export async function getProjectStatusData() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Build query for projects
    const projectQuery: any = {}

    // For non-admin users, only show data from their hierarchy
    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      const hierarchyUsers = await getUserHierarchy(currentUser._id.toString())
      const hierarchyUserIds = hierarchyUsers.map((user) => user._id.toString())

      projectQuery.$or = [{ department: currentUser.department }, { assignedEmployees: { $in: hierarchyUserIds } }]
    }

    const projects = await find(Collections.PROJECTS, projectQuery)

    // Format data for chart
    const projectStatusData = projects.map((project) => ({
      name: project.name,
      value: project.progress,
      color: getColorForProject(project.progress),
    }))

    return projectStatusData
  } catch (error) {
    console.error("Error fetching project status data:", error)
    throw new Error("Failed to fetch project status data")
  }
}

// Helper function to get color based on project progress
function getColorForProject(progress: number) {
  if (progress < 25) return "#ef4444" // Red
  if (progress < 50) return "#f59e0b" // Amber
  if (progress < 75) return "#3b82f6" // Blue
  return "#10b981" // Green
}
