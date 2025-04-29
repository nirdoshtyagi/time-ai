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
import { Clock, Download, MoreHorizontal, Plus, Search, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/components/auth-provider"
import { TaskDialog } from "@/components/dialogs/task-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample task data
const tasks = [
  {
    id: "TSK001",
    name: "Design Homepage Mockup",
    project: "Website Redesign",
    subProject: "Frontend Development",
    assignedTo: "Robert Wilson",
    estimatedTime: 8,
    actualTime: 7.5,
    aiUsed: true,
    aiTool: "Midjourney",
    timeSaved: 3,
    status: "Completed",
  },
  {
    id: "TSK002",
    name: "Implement User Authentication",
    project: "Mobile App Development",
    subProject: "Authentication Module",
    assignedTo: "John Smith",
    estimatedTime: 16,
    actualTime: 12,
    aiUsed: true,
    aiTool: "GitHub Copilot",
    timeSaved: 4,
    status: "Completed",
  },
  {
    id: "TSK003",
    name: "Create Content Strategy",
    project: "Annual Marketing Campaign",
    subProject: "Content Strategy",
    assignedTo: "Emily Davis",
    estimatedTime: 10,
    actualTime: 8,
    aiUsed: true,
    aiTool: "ChatGPT",
    timeSaved: 2,
    status: "Completed",
  },
  {
    id: "TSK004",
    name: "Database Schema Design",
    project: "Data Migration",
    subProject: "Database Design",
    assignedTo: "Michael Chen",
    estimatedTime: 12,
    actualTime: 6,
    aiUsed: false,
    aiTool: "",
    timeSaved: 0,
    status: "In Progress",
  },
  {
    id: "TSK005",
    name: "User Testing Coordination",
    project: "Mobile App Development",
    subProject: "User Testing",
    assignedTo: "Jennifer Lee",
    estimatedTime: 20,
    actualTime: 0,
    aiUsed: false,
    aiTool: "",
    timeSaved: 0,
    status: "To Do",
  },
]

export default function TasksPage() {
  const { user, hasPermission } = useAuthContext()
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage tasks and track AI usage across your organization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1" onClick={() => setIsTaskDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Task Management</CardTitle>
          <CardDescription>View and manage all tasks across projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full appearance-none pl-8 shadow-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by project" />
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
                    <SelectValue placeholder="Filter by sub project" />
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
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
                  <TableHead>Task ID</TableHead>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Sub Project</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>AI Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.project}</TableCell>
                    <TableCell>{task.subProject}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {task.status === "Completed"
                            ? `${task.actualTime}h / ${task.estimatedTime}h`
                            : `${task.estimatedTime}h est.`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.aiUsed ? (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" />
                          <span>{task.aiTool}</span>
                          <Badge variant="outline" className="ml-1 text-xs">
                            {task.timeSaved}h saved
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "default"
                            : task.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          task.status === "Completed"
                            ? "bg-green-500"
                            : task.status === "In Progress"
                              ? "bg-blue-500"
                              : ""
                        }
                      >
                        {task.status}
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
                          <DropdownMenuItem>Edit task</DropdownMenuItem>
                          <DropdownMenuItem>Reassign task</DropdownMenuItem>
                          <DropdownMenuItem>Update status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete task</DropdownMenuItem>
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

      <TaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} />
    </div>
  )
}
