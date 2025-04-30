"use server"

import { Collections, find, insertOne, updateOne, deleteOne, toObjectId, getUserHierarchy } from "../db-service"
import { getCurrentUser } from "./auth-actions"
import type { Project } from "../models"

export async function getProjects(searchQuery = "", departmentFilter = "", statusFilter = "") {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Build query
    const query: any = {}

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ]
    }

    if (departmentFilter && departmentFilter !== "all") {
      query.department = departmentFilter
    }

    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter
    }

    // For non-admin users, only show projects from their department or assigned to them
    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      const hierarchyUsers = await getUserHierarchy(currentUser._id.toString())
      const hierarchyUserIds = hierarchyUsers.map((user) => user._id.toString())

      query.$or = [{ department: currentUser.department }, { assignedEmployees: { $in: hierarchyUserIds } }]
    }

    const projects = await find(Collections.PROJECTS, query)
    return projects
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function addProject(projectData: Partial<Project>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Add timestamps
    const now = new Date()
    const newProject = {
      ...projectData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await insertOne(Collections.PROJECTS, newProject)
    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Error adding project:", error)
    throw new Error("Failed to add project")
  }
}

export async function updateProject(id: string, projectData: Partial<Project>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Update timestamp
    projectData.updatedAt = new Date()

    await updateOne(Collections.PROJECTS, { _id: toObjectId(id) }, projectData)
    return { success: true }
  } catch (error) {
    console.error("Error updating project:", error)
    throw new Error("Failed to update project")
  }
}

export async function deleteProject(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    await deleteOne(Collections.PROJECTS, { _id: toObjectId(id) })
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    throw new Error("Failed to delete project")
  }
}
