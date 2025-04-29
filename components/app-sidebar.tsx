"use client"

import { BarChart3, Calendar, Clock, Cog, Layers, LayoutDashboard, LogOut, PieChart, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/auth-provider"
import { hasRouteAccess } from "@/lib/auth"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthContext()

  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Employees",
      href: "/dashboard/employees",
      icon: Users,
      requiredRole: "admin",
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: Layers,
      requiredRole: "manager",
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: Calendar,
      requiredRole: "employee",
    },
    {
      title: "Time Tracking",
      href: "/dashboard/time-tracking",
      icon: Clock,
      requiredRole: "employee",
    },
    {
      title: "AI Adoption",
      href: "/dashboard/ai-adoption",
      icon: PieChart,
      requiredRole: "manager",
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      requiredRole: "admin",
    },
  ]

  // Admin only items
  const adminItems = [
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Cog,
      requiredRole: "super_admin",
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => !item.requiredRole || (user && hasRouteAccess(user, item.href)))

  const filteredAdminItems = adminItems.filter(
    (item) => !item.requiredRole || (user && hasRouteAccess(user, item.href)),
  )

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">TimeTrack AI</span>
            <span className="text-xs text-muted-foreground">Management Tool</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredAdminItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredAdminItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt="Avatar" />
              <AvatarFallback>{user?.name?.substring(0, 2) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
