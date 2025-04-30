"use server"

import { Collections, find, insertOne, updateOne, deleteOne, toObjectId, getUserHierarchy } from "../db-service"
import { getCurrentUser } from "./auth-actions"
import type { TimeEntry } from "../models"

export async function getTimeEntries(searchQuery = "", employeeFilter = "", projectFilter = "", dateRange = {}) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Build query
    const query: any = {}

    if (searchQuery) {
      query.$or = [
        { project: { $regex: searchQuery, $options: "i" } },
        { task: { $regex: searchQuery, $options: "i" } },
      ]
    }

    if (employeeFilter && employeeFilter !== "all") {
      query.userId = employeeFilter
    }

    if (projectFilter && projectFilter !== "all") {
      query.projectId = projectFilter
    }

    if (dateRange && dateRange.from && dateRange.to) {
      query.date = {
        $gte: new Date(dateRange.from),
        $lte: new Date(dateRange.to),
      }
    }

    // For non-admin users, only show time entries from themselves or their subordinates
    if (currentUser.role !== "super_admin" && currentUser.role !== "admin") {
      const hierarchyUsers = await getUserHierarchy(currentUser._id.toString())
      const hierarchyUserIds = hierarchyUsers.map((user) => user._id.toString())

      query.userId = { $in: hierarchyUserIds }
    }

    const timeEntries = await find(Collections.TIME_ENTRIES, query)
    return timeEntries
  } catch (error) {
    console.error("Error fetching time entries:", error)
    throw new Error("Failed to fetch time entries")
  }
}

export async function addTimeEntry(timeEntryData: Partial<TimeEntry>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Add timestamps and current user if not specified
    const now = new Date()
    const newTimeEntry = {
      ...timeEntryData,
      userId: timeEntryData.userId || currentUser._id.toString(),
      employee: timeEntryData.employee || currentUser.name,
      createdAt: now,
      updatedAt: now,
    }

    const result = await insertOne(Collections.TIME_ENTRIES, newTimeEntry)
    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Error adding time entry:", error)
    throw new Error("Failed to add time entry")
  }
}

export async function updateTimeEntry(id: string, timeEntryData: Partial<TimeEntry>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Update timestamp
    timeEntryData.updatedAt = new Date()

    await updateOne(Collections.TIME_ENTRIES, { _id: toObjectId(id) }, timeEntryData)
    return { success: true }
  } catch (error) {
    console.error("Error updating time entry:", error)
    throw new Error("Failed to update time entry")
  }
}

export async function deleteTimeEntry(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    await deleteOne(Collections.TIME_ENTRIES, { _id: toObjectId(id) })
    return { success: true }
  } catch (error) {
    console.error("Error deleting time entry:", error)
    throw new Error("Failed to delete time entry")
  }
}
