import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

// Database and collection names
export const Collections = {
  USERS: "users",
  DEPARTMENTS: "departments",
  PROJECTS: "projects",
  TASKS: "tasks",
  TIME_ENTRIES: "time_entries",
  AI_TOOLS: "ai_tools",
}

// Initialize database and collections
export async function initializeDatabase() {
  const client = await clientPromise
  const db = client.db("time_management")

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)

  for (const collection of Object.values(Collections)) {
    if (!collectionNames.includes(collection)) {
      await db.createCollection(collection)
      console.log(`Created collection: ${collection}`)
    }
  }

  // Create indexes for better performance
  await db.collection(Collections.USERS).createIndex({ email: 1 }, { unique: true })
  await db.collection(Collections.PROJECTS).createIndex({ name: 1 })
  await db.collection(Collections.TASKS).createIndex({ projectId: 1 })
  await db.collection(Collections.TIME_ENTRIES).createIndex({ taskId: 1 })
  await db.collection(Collections.TIME_ENTRIES).createIndex({ userId: 1 })

  return { db, collections: Collections }
}

// Generic database operations
export async function getCollection(collectionName: string) {
  const client = await clientPromise
  const db = client.db("time_management")
  return db.collection(collectionName)
}

export async function findOne(collectionName: string, query: any) {
  const collection = await getCollection(collectionName)
  return collection.findOne(query)
}

export async function find(collectionName: string, query: any = {}, options: any = {}) {
  const collection = await getCollection(collectionName)
  return collection.find(query, options).toArray()
}

export async function insertOne(collectionName: string, document: any) {
  const collection = await getCollection(collectionName)
  return collection.insertOne(document)
}

export async function updateOne(collectionName: string, filter: any, update: any) {
  const collection = await getCollection(collectionName)
  return collection.updateOne(filter, { $set: update })
}

export async function deleteOne(collectionName: string, filter: any) {
  const collection = await getCollection(collectionName)
  return collection.deleteOne(filter)
}

// Helper function to convert string ID to ObjectId
export function toObjectId(id: string) {
  return new ObjectId(id)
}

// Helper function to get user hierarchy (all users under a manager)
export async function getUserHierarchy(userId: string) {
  const users = await getCollection(Collections.USERS)

  // Find the user
  const user = await users.findOne({ _id: new ObjectId(userId) })
  if (!user) return []

  // For super_admin and admin, return all users
  if (user.role === "super_admin" || user.role === "admin") {
    return users.find({}).toArray()
  }

  // For managers, recursively find all users that report to them
  const subordinates = []

  async function findSubordinates(managerId: string) {
    const directReports = await users.find({ managerId: managerId }).toArray()

    for (const report of directReports) {
      subordinates.push(report)
      // Recursively find reports of this user if they're a manager
      await findSubordinates(report._id.toString())
    }
  }

  await findSubordinates(userId)

  // Include the user themselves
  return [user, ...subordinates]
}

// Employee functions
export async function getEmployees(query = {}) {
  return find(Collections.USERS, query)
}

export async function getEmployeeById(id: string) {
  return findOne(Collections.USERS, { _id: new ObjectId(id) })
}

export async function createEmployee(employee: any) {
  const result = await insertOne(Collections.USERS, employee)
  return { ...employee, _id: result.insertedId }
}

export async function updateEmployee(id: string, employee: any) {
  await updateOne(Collections.USERS, { _id: new ObjectId(id) }, employee)
  return getEmployeeById(id)
}

export async function deleteEmployee(id: string) {
  await deleteOne(Collections.USERS, { _id: new ObjectId(id) })
  return { id }
}

// Department functions
export async function getDepartments(query = {}) {
  return find(Collections.DEPARTMENTS, query)
}

export async function getDepartmentById(id: string) {
  return findOne(Collections.DEPARTMENTS, { _id: new ObjectId(id) })
}

export async function createDepartment(department: any) {
  const result = await insertOne(Collections.DEPARTMENTS, department)
  return { ...department, _id: result.insertedId }
}

// Project functions
export async function getProjects(query = {}) {
  return find(Collections.PROJECTS, query)
}

export async function getProjectById(id: string) {
  return findOne(Collections.PROJECTS, { _id: new ObjectId(id) })
}

export async function createProject(project: any) {
  const result = await insertOne(Collections.PROJECTS, project)
  return { ...project, _id: result.insertedId }
}

export async function updateProject(id: string, project: any) {
  await updateOne(Collections.PROJECTS, { _id: new ObjectId(id) }, project)
  return getProjectById(id)
}

export async function deleteProject(id: string) {
  await deleteOne(Collections.PROJECTS, { _id: new ObjectId(id) })
  return { id }
}

// Task functions
export async function getTasks(query = {}) {
  return find(Collections.TASKS, query)
}

export async function getTaskById(id: string) {
  return findOne(Collections.TASKS, { _id: new ObjectId(id) })
}

export async function createTask(task: any) {
  const result = await insertOne(Collections.TASKS, task)
  return { ...task, _id: result.insertedId }
}

export async function updateTask(id: string, task: any) {
  await updateOne(Collections.TASKS, { _id: new ObjectId(id) }, task)
  return getTaskById(id)
}

export async function deleteTask(id: string) {
  await deleteOne(Collections.TASKS, { _id: new ObjectId(id) })
  return { id }
}

// Time Entry functions
export async function getTimeEntries(query = {}) {
  return find(Collections.TIME_ENTRIES, query)
}

export async function getTimeEntryById(id: string) {
  return findOne(Collections.TIME_ENTRIES, { _id: new ObjectId(id) })
}

export async function createTimeEntry(timeEntry: any) {
  const result = await insertOne(Collections.TIME_ENTRIES, timeEntry)
  return { ...timeEntry, _id: result.insertedId }
}

export async function updateTimeEntry(id: string, timeEntry: any) {
  await updateOne(Collections.TIME_ENTRIES, { _id: new ObjectId(id) }, timeEntry)
  return getTimeEntryById(id)
}

export async function deleteTimeEntry(id: string) {
  await deleteOne(Collections.TIME_ENTRIES, { _id: new ObjectId(id) })
  return { id }
}

// AI Tools functions
export async function getAITools(query = {}) {
  return find(Collections.AI_TOOLS, query)
}

export async function getAIToolById(id: string) {
  return findOne(Collections.AI_TOOLS, { _id: new ObjectId(id) })
}

export async function createAITool(aiTool: any) {
  const result = await insertOne(Collections.AI_TOOLS, aiTool)
  return { ...aiTool, _id: result.insertedId }
}
