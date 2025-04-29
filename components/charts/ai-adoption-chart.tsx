"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

// Sample data for the AI adoption chart
const data = [
  { name: "Engineering", value: 82, color: "#4f46e5" },
  { name: "Marketing", value: 76, color: "#06b6d4" },
  { name: "Design", value: 68, color: "#f59e0b" },
  { name: "Product", value: 54, color: "#10b981" },
  { name: "HR", value: 42, color: "#ef4444" },
]

export function AIAdoptionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "AI Adoption Rate"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
