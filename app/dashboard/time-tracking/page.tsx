"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Download, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { useAuthContext } from "@/components/auth-provider"
import { TimeEntryDialog } from "@/components/dialogs/time-entry-dialog"
import { useToast } from "@/components/ui/use-toast"

export default function TimeTrackingPage() {
  const { user, hasPermission } = useAuthContext()
  const { toast } = useToast()
  const [isTimeEntryDialogOpen, setIsTimeEntryDialogOpen] = useState(false)
  const [timeEntries, setTimeEntries] = useState([])
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [employeeFilter, setEmployeeFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  useEffect(() => {
    fetchTimeEntries()
    fetchEmployees()
    fetchProjects()
  }, [])

  const fetchTimeEntries = async () => {
    setIsLoading(true)
    try {
      let url = `/api/time-entries?search=${searchQuery}`

      if (employeeFilter !== "all") {
        url += `&employee=${employeeFilter}`
      }

      if (projectFilter !== "all") {
        url += `&project=${projectFilter}`
      }

      if (dateRange.from && dateRange.to) {
        url += `&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch time entries")
      const data = await response.json()
      setTimeEntries(data)
    } catch (error) {
      console.error("Error fetching time entries:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch time entries. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
    fetchTimeEntries()
  }

  const handleTimeEntryAdded = () => {
    fetchTimeEntries()
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
          <p className="text-muted-foreground">Track and manage time spent on tasks and projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1" onClick={() => setIsTimeEntryDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Log Time
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>View and manage time entries across projects and tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col gap-4 pb-4 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search time entries..."
                  className="w-full appearance-none pl-8 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map((employee: any) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project: any) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DatePickerWithRange className="w-full" onDateChange={handleDateRangeChange} />
              </div>
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Sub Project</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>AI Usage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading time entries...
                    </TableCell>
                  </TableRow>
                ) : timeEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No time entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  timeEntries.map((entry: any) => (
                    <TableRow key={entry._id}>
                      <TableCell className="font-medium">{entry._id.toString().substring(0, 8)}</TableCell>
                      <TableCell>{entry.employee}</TableCell>
                      <TableCell>{entry.project}</TableCell>
                      <TableCell>{entry.subProject}</TableCell>
                      <TableCell>{entry.task}</TableCell>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{entry.timeSpent}h</span>
                          {entry.aiUsed && (
                            <Badge variant="outline" className="ml-1 text-xs">
                              {entry.timeSaved}h saved
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {entry.aiUsed ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {entry.aiTool}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={entry.status === "Completed" ? "default" : "secondary"}
                          className={entry.status === "Completed" ? "bg-green-500" : "bg-blue-500"}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TimeEntryDialog
        open={isTimeEntryDialogOpen}
        onOpenChange={setIsTimeEntryDialogOpen}
        projects={projects}
        onTimeEntryAdded={handleTimeEntryAdded}
      />
    </div>
  )
}
