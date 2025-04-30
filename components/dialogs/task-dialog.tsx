"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: any[]
  onTaskAdded?: () => void
}

export function TaskDialog({ open, onOpenChange, projects = [], onTaskAdded }: TaskDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dueDate, setDueDate] = useState<Date>()
  const [employees, setEmployees] = useState([])
  const [subProjects, setSubProjects] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
    project: "",
    subProject: "",
    assignedTo: "",
    estimatedTime: "",
    priority: "",
    description: "",
  })

  useEffect(() => {
    if (open) {
      fetchEmployees()
    }
  }, [open])

  useEffect(() => {
    // Update sub projects when project changes
    if (formData.projectId) {
      const selectedProject = projects.find((p) => p._id === formData.projectId)
      if (selectedProject && selectedProject.subProjects) {
        setSubProjects(selectedProject.subProjects)
        setFormData((prev) => ({ ...prev, project: selectedProject.name }))
      } else {
        setSubProjects([])
      }
    } else {
      setSubProjects([])
    }
  }, [formData.projectId, projects])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      if (!response.ok) throw new Error("Failed to fetch employees")
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error("Error fetching employees:", error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dueDate) {
      toast({
        variant: "destructive",
        title: "Missing due date",
        description: "Please select a due date for the task.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const taskData = {
        name: formData.name,
        projectId: formData.projectId,
        project: formData.project,
        subProject: formData.subProject,
        assignedTo: formData.assignedTo,
        estimatedTime: Number.parseFloat(formData.estimatedTime),
        actualTime: 0,
        aiUsed: false,
        status: "To Do",
        dueDate: dueDate,
        priority: formData.priority,
        description: formData.description,
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) throw new Error("Failed to add task")

      toast({
        title: "Task added successfully",
        description: "The new task has been added to the system.",
      })

      // Reset form
      setFormData({
        name: "",
        projectId: "",
        project: "",
        subProject: "",
        assignedTo: "",
        estimatedTime: "",
        priority: "",
        description: "",
      })
      setDueDate(undefined)

      onOpenChange(false)
      if (onTaskAdded) onTaskAdded()
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                placeholder="Design Homepage Mockup"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select required value={formData.projectId} onValueChange={(value) => handleChange("projectId", value)}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subProject">Sub Project</Label>
                <Select
                  required
                  value={formData.subProject}
                  onValueChange={(value) => handleChange("subProject", value)}
                  disabled={subProjects.length === 0}
                >
                  <SelectTrigger id="subProject">
                    <SelectValue placeholder="Select sub project" />
                  </SelectTrigger>
                  <SelectContent>
                    {subProjects.map((subProject) => (
                      <SelectItem key={subProject} value={subProject}>
                        {subProject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  required
                  value={formData.assignedTo}
                  onValueChange={(value) => handleChange("assignedTo", value)}
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee: any) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Hours</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  min="1"
                  placeholder="8"
                  required
                  value={formData.estimatedTime}
                  onChange={(e) => handleChange("estimatedTime", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select required value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description..."
                className="h-24"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
