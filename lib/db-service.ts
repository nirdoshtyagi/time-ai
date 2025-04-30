import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

// Database and collection names
const DB_NAME = "time_management"
const COLLECTIONS = {
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
  const db = client.db(DB_NAME)

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)

  for (const collection of Object.values(COLLECTIONS)) {
    if (!collectionNames.includes(collection)) {
      await db.createCollection(collection)
      console.log(`Created collection: ${collection}`)
    }
  }

  // Create indexes for better performance
  await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })
  await db.collection(COLLECTIONS.PROJECTS).createIndex({ name: 1 })
  await db.collection(COLLECTIONS.TASKS).createIndex({ projectId: 1 })
  await db.collection(COLLECTIONS.TIME_ENTRIES).createIndex({ taskId: 1 })
  await db.collection(COLLECTIONS.TIME_ENTRIES).createIndex({ userId: 1 })

  return { db, collections: COLLECTIONS }
}

// Generic database operations
export async function getCollection(collectionName: string) {
  const client = await clientPromise
  const db = client.db(DB_NAME)
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
  const users = await getCollection(COLLECTIONS.USERS)

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

// Export collections for easy access
export const Collections = COLLECTIONS
