"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/components/auth-provider"
import {
  Bar,
  BarChart as RechartBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

// Sample AI tools data
const aiTools = [
  {
    name: "ChatGPT",
    category: "Text Generation",
    usageCount: 245,
    timeSaved: 128,
    departments: ["Marketing", "Engineering", "Product"],
    trend: "increasing",
  },
  {
    name: "GitHub Copilot",
    category: "Code Generation",
    usageCount: 187,
    timeSaved: 94,
    departments: ["Engineering"],
    trend: "increasing",
  },
  {
    name: "Midjourney",
    category: "Image Generation",
    usageCount: 112,
    timeSaved: 76,
    departments: ["Design", "Marketing"],
    trend: "stable",
  },
  {
    name: "Claude",
    category: "Text Generation",
    usageCount: 89,
    timeSaved: 42,
    departments: ["Product", "HR", "Marketing"],
    trend: "increasing",
  },
  {
    name: "Jasper",
    category: "Content Creation",
    usageCount: 67,
    timeSaved: 38,
    departments: ["Marketing"],
    trend: "decreasing",
  },
]

// Sample department data
const departments = [
  {
    name: "Engineering",
    aiAdoptionRate: 82,
    tasksWithAI: 324,
    timeSaved: 168,
    topTools: ["GitHub Copilot", "ChatGPT"],
    trend: "increasing",
  },
  {
    name: "Marketing",
    aiAdoptionRate: 76,
    tasksWithAI: 287,
    timeSaved: 142,
    topTools: ["ChatGPT", "Midjourney", "Jasper"],
    trend: "increasing",
  },
  {
    name: "Design",
    aiAdoptionRate: 68,
    tasksWithAI: 156,
    timeSaved: 98,
    topTools: ["Midjourney", "ChatGPT"],
    trend: "stable",
  },
  {
    name: "Product",
    aiAdoptionRate: 54,
    tasksWithAI: 124,
    timeSaved: 67,
    topTools: ["ChatGPT", "Claude"],
    trend: "increasing",
  },
  {
    name: "HR",
    aiAdoptionRate: 42,
    tasksWithAI: 87,
    timeSaved: 43,
    topTools: ["Claude", "ChatGPT"],
    trend: "stable",
  },
]

// Data for charts
const departmentAdoptionData = departments.map((dept) => ({
  name: dept.name,
  "AI Adoption Rate": dept.aiAdoptionRate,
}))

const toolUsageData = [
  { name: "ChatGPT", value: 245, color: "#4f46e5" },
  { name: "GitHub Copilot", value: 187, color: "#06b6d4" },
  { name: "Midjourney", value: 112, color: "#f59e0b" },
  { name: "Claude", value: 89, color: "#10b981" },
  { name: "Jasper", value: 67, color: "#ef4444" },
]

export default function AIAdoptionPage() {
  const { user, hasPermission } = useAuthContext()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Adoption</h1>
        <p className="text-muted-foreground">Track AI tool usage and time savings across your organization</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall AI Adoption</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Using AI</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">978</div>
            <p className="text-xs text-muted-foreground">+24% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">518 hours</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used AI Tool</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ChatGPT</div>
            <p className="text-xs text-muted-foreground">245 uses this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-department">By Department</TabsTrigger>
          <TabsTrigger value="by-tool">By AI Tool</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>AI Adoption by Department</CardTitle>
                <CardDescription>Percentage of tasks using AI tools across departments</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart data={departmentAdoptionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "AI Adoption Rate"]} />
                      <Legend />
                      <Bar dataKey="AI Adoption Rate" fill="#f59e0b" />
                    </RechartBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>AI Tool Usage Distribution</CardTitle>
                <CardDescription>Breakdown of AI tool usage across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={toolUsageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {toolUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} uses`, "Usage Count"]} />
                      <Legend />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="by-department">
          <Card>
            <CardHeader>
              <CardTitle>AI Adoption by Department</CardTitle>
              <CardDescription>Detailed breakdown of AI usage across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Adoption Rate</TableHead>
                    <TableHead>Tasks with AI</TableHead>
                    <TableHead>Time Saved</TableHead>
                    <TableHead>Top Tools</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.name}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.aiAdoptionRate}%</TableCell>
                      <TableCell>{dept.tasksWithAI}</TableCell>
                      <TableCell>{dept.timeSaved} hours</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {dept.topTools.map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            dept.trend === "increasing"
                              ? "default"
                              : dept.trend === "stable"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            dept.trend === "increasing" ? "bg-green-500" : dept.trend === "stable" ? "bg-blue-500" : ""
                          }
                        >
                          {dept.trend}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-tool">
          <Card>
            <CardHeader>
              <CardTitle>AI Tool Usage</CardTitle>
              <CardDescription>Detailed breakdown of AI tool usage across the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Usage Count</TableHead>
                    <TableHead>Time Saved</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aiTools.map((tool) => (
                    <TableRow key={tool.name}>
                      <TableCell className="font-medium">{tool.name}</TableCell>
                      <TableCell>{tool.category}</TableCell>
                      <TableCell>{tool.usageCount}</TableCell>
                      <TableCell>{tool.timeSaved} hours</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tool.departments.map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tool.trend === "increasing"
                              ? "default"
                              : tool.trend === "stable"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            tool.trend === "increasing" ? "bg-green-500" : tool.trend === "stable" ? "bg-blue-500" : ""
                          }
                        >
                          {tool.trend}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="h-[400px] rounded-md border">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Trends Content</h3>
              <p className="text-sm text-muted-foreground">AI adoption trends over time will be displayed here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
