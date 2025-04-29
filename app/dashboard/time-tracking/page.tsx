"use client"

import { useState } from "react"
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

// Sample time tracking data
const timeEntries = [
  {
    id: "TE001",
    employee: "John Smith",
    project: "Website Redesign",
    subProject: "Frontend Development",
    task: "Design Homepage Mockup",
    date: "2023-11-15",
    timeSpent: 7.5,
    aiUsed: true,
    aiTool: "Midjourney",
    timeSaved: 3,
    status: "Completed",
  },
  {
    id: "TE002",
    employee: "Emily Davis",
    project: "Mobile App Development",
    subProject: "Authentication Module",
    task: "Implement User Authentication",
    date: "2023-11-16",
    timeSpent: 6.5,
    aiUsed: true,
    aiTool: "GitHub Copilot",
    timeSaved: 2.5,
    status: "Completed",
  },
  {
    id: "TE003",
    employee: "Robert Wilson",
    project: "Annual Marketing Campaign",
    subProject: "Content Strategy",
    task: "Create Content Strategy",
    date: "2023-11-17",
    timeSpent: 8,
    aiUsed: true,
    aiTool: "ChatGPT",
    timeSaved: 2,
    status: "Completed",
  },
  {
    id: "TE004",
    employee: "Michael Chen",
    project: "Data Migration",
    subProject: "Database Design",
    task: "Database Schema Design",
    date: "2023-11-18",
    timeSpent: 6,
    aiUsed: false,
    aiTool: "",
    timeSaved: 0,
    status: "In Progress",
  },
  {
    id: "TE005",
    employee: "Jennifer Lee",
    project: "Mobile App Development",
    subProject: "User Testing",
    task: "User Testing Coordination",
    date: "2023-11-19",
    timeSpent: 4.5,
    aiUsed: false,
    aiTool: "",
    timeSaved: 0,
    status: "In Progress",
  },
]

export default function TimeTrackingPage() {
  const { user, hasPermission } = useAuthContext()
  const [isTimeEntryDialogOpen, setIsTimeEntryDialogOpen] = useState(false)

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
          <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search time entries..."
                  className="w-full appearance-none pl-8 shadow-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by employee" />
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
                <DatePickerWithRange className="w-full" />
              </div>
            </div>
          </div>
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
                {timeEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.id}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <TimeEntryDialog open={isTimeEntryDialogOpen} onOpenChange={setIsTimeEntryDialogOpen} />
    </div>
  )
}
