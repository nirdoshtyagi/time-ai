"use client"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Sample data for the performance chart
const data = [
  {
    name: "Engineering",
    "Tasks Completed": 120,
    "Time Efficiency": 85,
    "AI Usage": 72,
  },
  {
    name: "Marketing",
    "Tasks Completed": 98,
    "Time Efficiency": 78,
    "AI Usage": 65,
  },
  {
    name: "Design",
    "Tasks Completed": 86,
    "Time Efficiency": 90,
    "AI Usage": 78,
  },
  {
    name: "Product",
    "Tasks Completed": 99,
    "Time Efficiency": 82,
    "AI Usage": 68,
  },
  {
    name: "HR",
    "Tasks Completed": 65,
    "Time Efficiency": 75,
    "AI Usage": 45,
  },
]

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Tasks Completed" fill="#4f46e5" />
        <Bar dataKey="Time Efficiency" fill="#06b6d4" />
        <Bar dataKey="AI Usage" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  )
}
