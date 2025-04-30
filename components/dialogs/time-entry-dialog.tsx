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
import { Switch } from "@/components/ui/switch"

interface TimeEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: any[]
  onTimeEntryAdded?: () => void
}

export function TimeEntryDialog({ open, onOpenChange, projects = [], onTimeEntryAdded }: TimeEntryDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [aiUsed, setAiUsed] = useState(false)
  const [tasks, setTasks] = useState([])
  const [subProjects, setSubProjects] = useState<string[]>([])
  const [aiTools, setAiTools] = useState([])

  const [formData, setFormData] = useState({
    projectId: "",
    project: "",
    subProject: "",
    taskId: "",
    task: "",
    timeSpent: "",
    aiTool: "",
    timeSaved: "",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      fetchAiTools()
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
    // Reset task when project changes
    setFormData((prev) => ({ ...prev, taskId: "", task: "", subProject: "" }))
    setTasks([])
  }, [formData.projectId, projects])

  useEffect(() => {
    // Fetch tasks when project and subProject are selected
    if (formData.projectId && formData.subProject) {
      fetchTasks(formData.projectId, formData.subProject)
    }
  }, [formData.projectId, formData.subProject])

  const fetchTasks = async (projectId: string, subProject: string) => {
    try {
      const response = await fetch(`/api/tasks?project=${projectId}&subProject=${subProject}`)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const fetchAiTools = async () => {
    try {
      const response = await fetch("/api/ai-tools")
      if (!response.ok) throw new Error("Failed to fetch AI tools")
      const data = await response.json()
      setAiTools(data)
    } catch (error) {
      console.error("Error fetching AI tools:", error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTaskChange = (taskId: string) => {
    const selectedTask = tasks.find((t: any) => t._id === taskId)
    if (selectedTask) {
      setFormData((prev) => ({
        ...prev,
        taskId: taskId,
        task: selectedTask.name,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const timeEntryData = {
        projectId: formData.projectId,
        project: formData.project,
        subProject: formData.subProject,
        taskId: formData.taskId,
        task: formData.task,
        date: date,
        timeSpent: Number.parseFloat(formData.timeSpent),
        aiUsed: aiUsed,
        aiTool: aiUsed ? formData.aiTool : "",
        timeSaved: aiUsed ? Number.parseFloat(formData.timeSaved) : 0,
        status: "Completed",
        notes: formData.notes,
      }

      const response = await fetch("/api/time-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timeEntryData),
      })

      if (!response.ok) throw new Error("Failed to add time entry")

      toast({
        title: "Time entry logged successfully",
        description: "Your time entry has been recorded.",
      })

      // Reset form
      setFormData({
        projectId: "",
        project: "",
        subProject: "",
        taskId: "",
        task: "",
        timeSpent: "",
        aiTool: "",
        timeSaved: "",
        notes: "",
      })
      setDate(new Date())
      setAiUsed(false)

      onOpenChange(false)
      if (onTimeEntryAdded) onTimeEntryAdded()
    } catch (error) {
      console.error("Error adding time entry:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add time entry. Please try again.",
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
            <DialogTitle>Log Time Entry</DialogTitle>
            <DialogDescription>Record time spent on a task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <div className="space-y-2">
              <Label htmlFor="task">Task</Label>
              <Select required value={formData.taskId} onValueChange={handleTaskChange} disabled={tasks.length === 0}>
                <SelectTrigger id="task">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task: any) => (
                    <SelectItem key={task._id} value={task._id}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeSpent">Hours Spent</Label>
                <Input
                  id="timeSpent"
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="8"
                  required
                  value={formData.timeSpent}
                  onChange={(e) => handleChange("timeSpent", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="aiUsed">AI Tools Used</Label>
                <Switch id="aiUsed" checked={aiUsed} onCheckedChange={setAiUsed} />
              </div>
            </div>
            {aiUsed && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aiTool">AI Tool</Label>
                  <Select
                    required={aiUsed}
                    value={formData.aiTool}
                    onValueChange={(value) => handleChange("aiTool", value)}
                  >
                    <SelectTrigger id="aiTool">
                      <SelectValue placeholder="Select AI tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiTools.map((tool: any) => (
                        <SelectItem key={tool._id} value={tool.name}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeSaved">Hours Saved</Label>
                  <Input
                    id="timeSaved"
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="2"
                    required={aiUsed}
                    value={formData.timeSaved}
                    onChange={(e) => handleChange("timeSaved", e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                className="h-24"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging..." : "Log Time"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
