"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, MoreHorizontal, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample project data
const projects = [
  {
    id: "PRJ001",
    name: "Website Redesign",
    category: "Web Development",
    department: "Marketing",
    subProjects: ["Frontend Development", "Backend Development", "Content Migration"],
    startDate: "2023-10-15",
    endDate: "2024-01-15",
    status: "In Progress",
    progress: 65,
    assignedEmployees: 8,
  },
  {
    id: "PRJ002",
    name: "Mobile App Development",
    category: "App Development",
    department: "Engineering",
    subProjects: ["Authentication Module", "User Interface", "API Integration", "User Testing"],
    startDate: "2023-11-01",
    endDate: "2024-03-30",
    status: "In Progress",
    progress: 40,
    assignedEmployees: 12,
  },
  {
    id: "PRJ003",
    name: "Data Migration",
    category: "Data Engineering",
    department: "IT",
    subProjects: ["Database Design", "ETL Process", "Data Validation"],
    startDate: "2023-12-01",
    endDate: "2024-01-15",
    status: "In Progress",
    progress: 80,
    assignedEmployees: 5,
  },
  {
    id: "PRJ004",
    name: "Annual Marketing Campaign",
    category: "Marketing",
    department: "Marketing",
    subProjects: ["Content Strategy", "Social Media", "Email Marketing", "Analytics"],
    startDate: "2023-09-01",
    endDate: "2023-12-31",
    status: "Completed",
    progress: 100,
    assignedEmployees: 7,
  },
  {
    id: "PRJ005",
    name: "HR System Implementation",
    category: "Software Implementation",
    department: "HR",
    subProjects: ["Requirements Gathering", "System Configuration", "Data Migration", "User Training"],
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    status: "Not Started",
    progress: 0,
    assignedEmployees: 4,
  },
]

export default function ProjectsPage() {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your organization's projects and track their progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1" onClick={() => setIsProjectDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Project Directory</CardTitle>
          <CardDescription>View and manage all projects in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="w-full appearance-none pl-8 shadow-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Sub Projects</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.assignedEmployees} employees assigned
                      </div>
                    </TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>{project.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.subProjects.slice(0, 2).map((subProject) => (
                          <Badge key={subProject} variant="outline" className="text-xs">
                            {subProject}
                          </Badge>
                        ))}
                        {project.subProjects.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.subProjects.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {new Date(project.startDate).toLocaleDateString()} -{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2 w-[60px]" />
                        <span className="text-xs">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "Completed"
                            ? "default"
                            : project.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          project.status === "Completed"
                            ? "bg-green-500"
                            : project.status === "In Progress"
                              ? "bg-blue-500"
                              : ""
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit project</DropdownMenuItem>
                          <DropdownMenuItem>Assign employees</DropdownMenuItem>
                          <DropdownMenuItem>View tasks</DropdownMenuItem>
                          <DropdownMenuItem>Manage sub projects</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Archive project</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
