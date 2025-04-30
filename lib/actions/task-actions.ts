"use server"

import {
  Collections,
  find,
  findOne,
  insertOne,
  updateOne,
  deleteOne,
  toObjectId,
  getUserHierarchy,
} from "../db-service"
import { getCurrentUser } from "./auth-actions"
import type { Task } from "../models"

export async function getTasks(searchQuery = "", projectFilter = "", subProjectFilter = "", statusFilter = "") {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Build query
    const query: any = {}

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { project: { $regex: searchQuery, $options: "i" } },
      ]
    }

    if (projectFilter && projectFilter !== "all") {
      query.project = projectFilter
    }

    if (subProjectFilter && subProjectFilter !== "all") {
      query.subProject = subProjectFilter
    }

    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter
    }

    // For non-admin users, only show tasks assigned to them or their subordinates
    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      const hierarchyUsers = await getUserHierarchy(currentUser._id.toString())
      const hierarchyUserIds = hierarchyUsers.map((user) => user._id.toString())

      query.assignedTo = { $in: hierarchyUserIds }
    }

    const tasks = await find(Collections.TASKS, query)

    // Get assignee names
    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        let assignee = null
        if (task.assignedTo) {
          assignee = await findOne(Collections.USERS, { _id: toObjectId(task.assignedTo) })
        }

        return {
          ...task,
          assignedToName: assignee ? assignee.name : "Unassigned",
        }
      }),
    )

    return tasksWithAssignees
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function addTask(taskData: Partial<Task>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Add timestamps
    const now = new Date()
    const newTask = {
      ...taskData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await insertOne(Collections.TASKS, newTask)

    // Send notification email to assigned user
    if (taskData.assignedTo) {
      await sendTaskNotification(taskData.assignedTo, "new", taskData.name || "")
    }

    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Error adding task:", error)
    throw new Error("Failed to add task")
  }
}

export async function updateTask(id: string, taskData: Partial<Task>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Update timestamp
    taskData.updatedAt = new Date()

    // Get original task to check for status change
    const originalTask = await findOne(Collections.TASKS, { _id: toObjectId(id) })

    await updateOne(Collections.TASKS, { _id: toObjectId(id) }, taskData)

    // Send notification if status changed
    if (originalTask && taskData.status && originalTask.status !== taskData.status) {
      await sendTaskNotification(originalTask.assignedTo, "update", originalTask.name)
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating task:", error)
    throw new Error("Failed to update task")
  }
}

export async function deleteTask(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    await deleteOne(Collections.TASKS, { _id: toObjectId(id) })
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    throw new Error("Failed to delete task")
  }
}

// Helper function to send email notifications for task updates
async function sendTaskNotification(userId: string, type: "new" | "update", taskName: string) {
  try {
    const user = await findOne(Collections.USERS, { _id: toObjectId(userId) })
    if (!user || !user.email) return

    // In a real app, you would send an actual email here
    console.log(`Sending ${type} task notification to ${user.email} for task: ${taskName}`)

    // For now, we'll just log it
    return { success: true }
  } catch (error) {
    console.error("Error sending task notification:", error)
  }
}
