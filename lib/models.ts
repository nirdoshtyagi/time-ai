import type { ObjectId } from "mongodb"

export type UserRole = "super_admin" | "admin" | "manager" | "employee"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: UserRole
  avatar?: string
  department?: string
  managerId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Department {
  _id?: ObjectId
  name: string
  code: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Project {
  _id?: ObjectId
  name: string
  category: string
  department: string
  subProjects: string[]
  startDate: Date
  endDate: Date
  status: "Not Started" | "In Progress" | "Completed"
  progress: number
  assignedEmployees: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Task {
  _id?: ObjectId
  name: string
  projectId: string
  project: string
  subProject: string
  assignedTo: string
  estimatedTime: number
  actualTime: number
  aiUsed: boolean
  aiTool?: string
  timeSaved?: number
  status: "To Do" | "In Progress" | "Completed"
  dueDate: Date
  priority: "Low" | "Medium" | "High" | "Urgent"
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TimeEntry {
  _id?: ObjectId
  userId: string
  employee: string
  projectId: string
  project: string
  subProject: string
  taskId: string
  task: string
  date: Date
  timeSpent: number
  aiUsed: boolean
  aiTool?: string
  timeSaved?: number
  status: "In Progress" | "Completed"
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface AITool {
  _id?: ObjectId
  name: string
  category: string
  usageCount: number
  timeSaved: number
  departments: string[]
  trend: "increasing" | "stable" | "decreasing"
  description?: string
  url?: string
  createdAt?: Date
  updatedAt?: Date
}
