"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthContext } from "@/components/auth-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

// Sample data for reports
const timeEfficiencyData = [
  { name: "Week 1", Actual: 120, Estimated: 140 },
  { name: "Week 2", Actual: 132, Estimated: 145 },
  { name: "Week 3", Actual: 125, Estimated: 150 },
  { name: "Week 4", Actual: 118, Estimated: 135 },
  { name: "Week 5", Actual: 110, Estimated: 130 },
]

const aiAdoptionTrendData = [
  { name: "Jan", Engineering: 65, Marketing: 55, Design: 45, Product: 40, HR: 30 },
  { name: "Feb", Engineering: 68, Marketing: 57, Design: 48, Product: 42, HR: 32 },
  { name: "Mar", Engineering: 72, Marketing: 60, Design: 52, Product: 45, HR: 35 },
  { name: "Apr", Engineering: 75, Marketing: 63, Design: 56, Product: 48, HR: 38 },
  { name: "May", Engineering: 78, Marketing: 67, Design: 60, Product: 50, HR: 40 },
  { name: "Jun", Engineering: 82, Marketing: 72, Design: 65, Product: 52, HR: 42 },
]

const projectCompletionData = [
  { name: "Website Redesign", value: 65, color: "#4f46e5" },
  { name: "Mobile App", value: 40, color: "#06b6d4" },
  { name: "Data Migration", value: 80, color: "#f59e0b" },
  { name: "Marketing Campaign", value: 95, color: "#10b981" },
  { name: "HR System", value: 15, color: "#ef4444" },
]

const departmentPerformanceData = [
  {
    name: "Engineering",
    "Task Completion": 92,
    "Time Efficiency": 85,
    "AI Adoption": 82,
  },
  {
    name: "Marketing",
    "Task Completion": 88,
    "Time Efficiency": 78,
    "AI Adoption": 76,
  },
  {
    name: "Design",
    "Task Completion": 90,
    "Time Efficiency": 82,
    "AI Adoption": 68,
  },
  {
    name: "Product",
    "Task Completion": 85,
    "Time Efficiency": 75,
    "AI Adoption": 54,
  },
  {
    name: "HR",
    "Task Completion": 80,
    "Time Efficiency": 70,
    "AI Adoption": 42,
  },
]

export default function ReportsPage() {
  const { user } = useAuthContext()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze performance, time efficiency, and AI adoption across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="col-span-1 md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Filter reports by various parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="emily">Emily Davis</SelectItem>
                  <SelectItem value="robert">Robert Wilson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                  <SelectItem value="jennifer">Jennifer Lee</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="website">Website Redesign</SelectItem>
                  <SelectItem value="mobile">Mobile App Development</SelectItem>
                  <SelectItem value="marketing">Annual Marketing Campaign</SelectItem>
                  <SelectItem value="data">Data Migration</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sub Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sub Projects</SelectItem>
                  <SelectItem value="frontend">Frontend Development</SelectItem>
                  <SelectItem value="backend">Backend Development</SelectItem>
                  <SelectItem value="auth">Authentication Module</SelectItem>
                  <SelectItem value="content">Content Strategy</SelectItem>
                  <SelectItem value="database">Database Design</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange className="w-full" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="gap-1">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="time-efficiency">Time Efficiency</TabsTrigger>
          <TabsTrigger value="ai-adoption">AI Adoption</TabsTrigger>
          <TabsTrigger value="project-status">Project Status</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Performance metrics across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Bar dataKey="Task Completion" fill="#4f46e5" />
                    <Bar dataKey="Time Efficiency" fill="#06b6d4" />
                    <Bar dataKey="AI Adoption" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="time-efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Efficiency Trend</CardTitle>
              <CardDescription>Actual vs. Estimated time spent on tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} hours`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="Actual" stroke="#4f46e5" strokeWidth={2} />
                    <Line type="monotone" dataKey="Estimated" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-adoption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Adoption Trend</CardTitle>
              <CardDescription>AI adoption percentage over time by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aiAdoptionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Line type="monotone" dataKey="Engineering" stroke="#4f46e5" strokeWidth={2} />
                    <Line type="monotone" dataKey="Marketing" stroke="#06b6d4" strokeWidth={2} />
                    <Line type="monotone" dataKey="Design" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="Product" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="HR" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="project-status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Completion Status</CardTitle>
              <CardDescription>Current completion percentage of active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectCompletionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {projectCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Completion"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
