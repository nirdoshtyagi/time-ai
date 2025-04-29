"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/components/auth-provider"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuthContext()

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleAddDepartment = () => {
    toast({
      title: "Department added",
      description: "The new department has been added successfully.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your system settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Organization Details</h3>
                  <p className="text-sm text-muted-foreground">Update your organization information</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" defaultValue="Techmagnate" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Organization Email</Label>
                    <Input id="org-email" type="email" defaultValue="info@techmagnate.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-phone">Organization Phone</Label>
                    <Input id="org-phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-website">Organization Website</Label>
                    <Input id="org-website" type="url" defaultValue="https://techmagnate.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">System Preferences</h3>
                  <p className="text-sm text-muted-foreground">Configure system-wide preferences</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mm-dd-yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-format">Time Format</Label>
                    <Select defaultValue="12h">
                      <SelectTrigger id="time-format">
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reporting-period">Default Reporting Period</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="reporting-period">
                        <SelectValue placeholder="Select reporting period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-8">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                        <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure security and access settings</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Two-factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch id="2fa" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="audit-logs">Audit Logs</Label>
                      <p className="text-sm text-muted-foreground">Enable detailed audit logging</p>
                    </div>
                    <Switch id="audit-logs" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Management</CardTitle>
              <CardDescription>Add, edit, or remove departments in your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Add New Department</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dept-name">Department Name</Label>
                    <Input id="dept-name" placeholder="e.g., Marketing" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept-code">Department Code</Label>
                    <Input id="dept-code" placeholder="e.g., MKT" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="dept-desc">Description</Label>
                    <Textarea id="dept-desc" placeholder="Brief description of the department" className="h-24" />
                  </div>
                </div>
                <Button onClick={handleAddDepartment}>Add Department</Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Existing Departments</h3>
                </div>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Name</th>
                        <th className="p-2 text-left font-medium">Code</th>
                        <th className="p-2 text-left font-medium">Employees</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Engineering</td>
                        <td className="p-2">ENG</td>
                        <td className="p-2">42</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Marketing</td>
                        <td className="p-2">MKT</td>
                        <td className="p-2">18</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Product</td>
                        <td className="p-2">PRD</td>
                        <td className="p-2">24</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Design</td>
                        <td className="p-2">DSG</td>
                        <td className="p-2">15</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Human Resources</td>
                        <td className="p-2">HR</td>
                        <td className="p-2">8</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Project Categories</CardTitle>
              <CardDescription>Manage project categories for better organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Add New Category</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name">Category Name</Label>
                    <Input id="cat-name" placeholder="e.g., Web Development" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-code">Category Code</Label>
                    <Input id="cat-code" placeholder="e.g., WEB" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cat-desc">Description</Label>
                    <Textarea id="cat-desc" placeholder="Brief description of the category" className="h-24" />
                  </div>
                </div>
                <Button>Add Category</Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Existing Categories</h3>
                </div>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Name</th>
                        <th className="p-2 text-left font-medium">Code</th>
                        <th className="p-2 text-left font-medium">Projects</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Web Development</td>
                        <td className="p-2">WEB</td>
                        <td className="p-2">12</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Mobile App Development</td>
                        <td className="p-2">MOB</td>
                        <td className="p-2">8</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Data Engineering</td>
                        <td className="p-2">DATA</td>
                        <td className="p-2">5</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Marketing</td>
                        <td className="p-2">MKT</td>
                        <td className="p-2">7</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-tools">
          <Card>
            <CardHeader>
              <CardTitle>AI Tools Configuration</CardTitle>
              <CardDescription>Manage AI tools that can be tracked in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Add New AI Tool</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tool-name">Tool Name</Label>
                    <Input id="tool-name" placeholder="e.g., ChatGPT" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tool-category">Category</Label>
                    <Select>
                      <SelectTrigger id="tool-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Generation</SelectItem>
                        <SelectItem value="code">Code Generation</SelectItem>
                        <SelectItem value="image">Image Generation</SelectItem>
                        <SelectItem value="data">Data Analysis</SelectItem>
                        <SelectItem value="content">Content Creation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tool-desc">Description</Label>
                    <Textarea id="tool-desc" placeholder="Brief description of the AI tool" className="h-24" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tool-url">Website URL (Optional)</Label>
                    <Input id="tool-url" placeholder="e.g., https://openai.com/chatgpt" />
                  </div>
                </div>
                <Button>Add AI Tool</Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Existing AI Tools</h3>
                </div>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Name</th>
                        <th className="p-2 text-left font-medium">Category</th>
                        <th className="p-2 text-left font-medium">Usage Count</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">ChatGPT</td>
                        <td className="p-2">Text Generation</td>
                        <td className="p-2">245</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">GitHub Copilot</td>
                        <td className="p-2">Code Generation</td>
                        <td className="p-2">187</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Midjourney</td>
                        <td className="p-2">Image Generation</td>
                        <td className="p-2">112</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Claude</td>
                        <td className="p-2">Text Generation</td>
                        <td className="p-2">89</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Role Management</CardTitle>
              <CardDescription>Configure user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Role</th>
                        <th className="p-2 text-left font-medium">Description</th>
                        <th className="p-2 text-left font-medium">Access Level</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Super Admin</td>
                        <td className="p-2">Full system access with all privileges</td>
                        <td className="p-2">100%</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Edit Permissions
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Admin</td>
                        <td className="p-2">High-level dashboards and reporting access</td>
                        <td className="p-2">80%</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Edit Permissions
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Reporting Manager (L1-L5)</td>
                        <td className="p-2">Manages assigned team members and projects</td>
                        <td className="p-2">60%</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Edit Permissions
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Employee</td>
                        <td className="p-2">Self-dashboard view only</td>
                        <td className="p-2">40%</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Edit Permissions
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">Notify users when they are assigned a new task</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Task Due Date Reminders</Label>
                      <p className="text-sm text-muted-foreground">Send reminders before task due dates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Project Updates</Label>
                      <p className="text-sm text-muted-foreground">Notify team members of project status changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Send weekly performance reports to managers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">System Notifications</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New User Registrations</Label>
                      <p className="text-sm text-muted-foreground">Notify admins when new users register</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Adoption Milestones</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when departments reach AI adoption milestones
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">Notify users about system maintenance and updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
