"use client"

import { Bell, Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const { user } = useAuthContext()

  // Role badge color mapping
  const roleBadgeColor = {
    super_admin: "bg-red-500",
    admin: "bg-purple-500",
    manager: "bg-blue-500",
    employee: "bg-green-500",
  }[user?.role || "employee"]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="w-full flex-1">
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-2">
        {user?.role && (
          <Badge className={roleBadgeColor}>
            {user.role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-blue-600" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
