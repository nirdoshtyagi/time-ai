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
import type { User } from "../models"

export async function getEmployees(searchQuery = "", departmentFilter = "", statusFilter = "") {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Get users based on hierarchy
    const hierarchyUsers = await getUserHierarchy(currentUser._id.toString())
    const hierarchyUserIds = hierarchyUsers.map((user) => user._id)

    // Build query
    const query: any = { _id: { $in: hierarchyUserIds } }

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { designation: { $regex: searchQuery, $options: "i" } },
      ]
    }

    if (departmentFilter && departmentFilter !== "all") {
      query.department = departmentFilter
    }

    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter
    }

    const employees = await find(Collections.USERS, query)

    // Get manager names for each employee
    const employeesWithManagers = await Promise.all(
      employees.map(async (employee) => {
        let manager = null
        if (employee.managerId) {
          manager = await findOne(Collections.USERS, { _id: toObjectId(employee.managerId) })
        }

        return {
          ...employee,
          manager: manager ? manager.name : "None",
        }
      }),
    )

    return employeesWithManagers
  } catch (error) {
    console.error("Error fetching employees:", error)
    throw new Error("Failed to fetch employees")
  }
}

export async function addEmployee(employeeData: Partial<User>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Add timestamps
    const now = new Date()
    const newEmployee = {
      ...employeeData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await insertOne(Collections.USERS, newEmployee)
    return { success: true, id: result.insertedId }
  } catch (error) {
    console.error("Error adding employee:", error)
    throw new Error("Failed to add employee")
  }
}

export async function updateEmployee(id: string, employeeData: Partial<User>) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    // Update timestamp
    employeeData.updatedAt = new Date()

    await updateOne(Collections.USERS, { _id: toObjectId(id) }, employeeData)
    return { success: true }
  } catch (error) {
    console.error("Error updating employee:", error)
    throw new Error("Failed to update employee")
  }
}

export async function deleteEmployee(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error("Not authenticated")

    await deleteOne(Collections.USERS, { _id: toObjectId(id) })
    return { success: true }
  } catch (error) {
    console.error("Error deleting employee:", error)
    throw new Error("Failed to delete employee")
  }
}

export async function getDepartments() {
  try {
    return await find(Collections.DEPARTMENTS)
  } catch (error) {
    console.error("Error fetching departments:", error)
    throw new Error("Failed to fetch departments")
  }
}
