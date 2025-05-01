import { initializeDatabase, Collections, insertOne } from "./db-service"
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from "./auth"

export async function initializeApp() {
  try {
    console.log("Initializing database...")
    const { db } = await initializeDatabase()

    // Check if super admin exists
    const usersCollection = db.collection(Collections.USERS)
    const superAdmin = await usersCollection.findOne({ email: SUPER_ADMIN_EMAIL })

    if (!superAdmin) {
      console.log("Creating super admin user...")
      await insertOne(Collections.USERS, {
        name: "Admin",
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        role: "super_admin",
        avatar: "/placeholder.svg?height=32&width=32",
        department: "Management",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Check if departments exist
    const departmentsCollection = db.collection(Collections.DEPARTMENTS)
    const departmentsCount = await departmentsCollection.countDocuments()

    if (departmentsCount === 0) {
      console.log("Creating default departments...")
      const departments = [
        { name: "Engineering", code: "ENG", description: "Software development team" },
        { name: "Marketing", code: "MKT", description: "Marketing and communications team" },
        { name: "Design", code: "DSG", description: "UI/UX design team" },
        { name: "Product", code: "PRD", description: "Product management team" },
        { name: "HR", code: "HR", description: "Human resources team" },
      ]

      for (const dept of departments) {
        await insertOne(Collections.DEPARTMENTS, {
          ...dept,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    // Check if AI tools exist
    const aiToolsCollection = db.collection(Collections.AI_TOOLS)
    const aiToolsCount = await aiToolsCollection.countDocuments()

    if (aiToolsCount === 0) {
      console.log("Creating default AI tools...")
      const aiTools = [
        {
          name: "ChatGPT",
          category: "Text Generation",
          usageCount: 245,
          timeSaved: 128,
          departments: ["Marketing", "Engineering", "Product"],
          trend: "increasing",
          description: "AI language model for text generation and conversation",
        },
        {
          name: "GitHub Copilot",
          category: "Code Generation",
          usageCount: 187,
          timeSaved: 94,
          departments: ["Engineering"],
          trend: "increasing",
          description: "AI pair programmer that helps write code",
        },
        {
          name: "Midjourney",
          category: "Image Generation",
          usageCount: 112,
          timeSaved: 76,
          departments: ["Design", "Marketing"],
          trend: "stable",
          description: "AI tool for generating images from text descriptions",
        },
        {
          name: "Claude",
          category: "Text Generation",
          usageCount: 89,
          timeSaved: 42,
          departments: ["Product", "HR", "Marketing"],
          trend: "increasing",
          description: "AI assistant for text generation and analysis",
        },
        {
          name: "Jasper",
          category: "Content Creation",
          usageCount: 67,
          timeSaved: 38,
          departments: ["Marketing"],
          trend: "decreasing",
          description: "AI content creation platform for marketing teams",
        },
      ]

      for (const tool of aiTools) {
        await insertOne(Collections.AI_TOOLS, {
          ...tool,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    console.log("Database initialization complete!")
    return { success: true }
  } catch (error) {
    console.error("Database initialization failed:", error)
    // Don't throw the error, just return failure
    return { success: false, error }
  }
}
