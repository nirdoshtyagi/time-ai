"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useToast } from "@/components/ui/use-toast"

export default function TasksPage() {
  const { user, hasPermission } = useAuthContext()
  const { toast } = useToast()
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [subProjects, setSubProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")
  const [subProjectFilter, setSubProjectFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [])

  useEffect(() => {
    // Update sub projects when project filter changes
    if (projectFilter !== "all") {
      const selectedProject = projects.find((p: any) => p.name === projectFilter)
      if (selectedProject && selectedProject.subProjects) {
        setSubProjects(selectedProject.subProjects)
      } else {
        setSubProjects([])
      }
    } else {
      // Collect all unique sub projects across all projects
      const allSubProjects = new Set<string>()
      projects.forEach((project: any) => {
        if (project.subProjects) {
          project.subProjects.forEach((sp: string) => allSubProjects.add(sp))
        }
      })
      setSubProjects(Array.from(allSubProjects))
    }
    // Reset sub project filter when project filter changes
    setSubProjectFilter("all")
  }, [projectFilter, projects])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/tasks?search=${searchQuery}&project=${projectFilter}&subProject=${subProjectFilter}&status=${statusFilter}`,
      )
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTasks()
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })

      fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      })
    }
  }

  const handleTaskAdded = () => {
    fetchTasks()
  }

  const handleUpdateTaskStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update task status")

      toast({
        title: "Task updated",
        description: `Task status changed to ${status}.`,
      })

      fetchTasks()
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status. Please try again.",
      })
    }
  }

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
          <Button
            className="gap-1"
            onClick={() => setIsTaskDialogOpen(true)}
            disabled={!hasPermission("canCreateTask")}
          >
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
          <form onSubmit={handleSearch} className="flex flex-col gap-4 pb-4 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full appearance-none pl-8 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project: any) => (
                      <SelectItem key={project._id} value={project.name}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={subProjectFilter} onValueChange={setSubProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by sub project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub Projects</SelectItem>
                    {subProjects.map((subProject: string) => (
                      <SelectItem key={subProject} value={subProject}>
                        {subProject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading tasks...
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No tasks found
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task: any) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium">{task._id.toString().substring(0, 8)}</TableCell>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.project}</TableCell>
                      <TableCell>{task.subProject}</TableCell>
                      <TableCell>{task.assignedToName}</TableCell>
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
                            <DropdownMenuItem disabled={!hasPermission("canEditTask")}>Edit task</DropdownMenuItem>
                            <DropdownMenuItem>Reassign task</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={task.status === "To Do" || !hasPermission("canEditTask")}
                              onClick={() => handleUpdateTaskStatus(task._id, "To Do")}
                            >
                              Mark as To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={task.status === "In Progress" || !hasPermission("canEditTask")}
                              onClick={() => handleUpdateTaskStatus(task._id, "In Progress")}
                            >
                              Mark as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={task.status === "Completed" || !hasPermission("canEditTask")}
                              onClick={() => handleUpdateTaskStatus(task._id, "Completed")}
                            >
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              disabled={!hasPermission("canDeleteTask")}
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              Delete task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        projects={projects}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  )
}
