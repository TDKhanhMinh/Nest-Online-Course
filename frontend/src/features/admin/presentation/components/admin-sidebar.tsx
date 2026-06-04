"use client"

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
} from "@/components/ui/sidebar"
import { useLogout } from "@/features/auth/presentation/hooks/use-auth-hooks"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Layers,
  ShieldCheck,
  BarChart3,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useLogout()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Course Management",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      title: "Category Management",
      href: "/admin/categories",
      icon: Layers,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-white/10">
      <SidebarHeader className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden text-ellipsis">
            NexLearn <span className="text-xs font-medium text-muted-foreground ml-1 text-primary">Admin</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-3 group-data-[collapsible=icon]:hidden">
            System Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? pathname.endsWith(item.href) 
                  : pathname.includes(item.href)
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-10 transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold shadow-sm shadow-primary/5"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary/80"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground/70")} />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className="w-full justify-start gap-3 h-10 hover:bg-destructive/10 hover:text-destructive transition-colors group-data-[collapsible=icon]:justify-center px-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
