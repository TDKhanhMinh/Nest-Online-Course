"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLogout, useMe } from "@/features/auth/presentation/hooks/use-auth-hooks"
import { Bell, LayoutDashboard, Search, Settings, User } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const { data: user } = useMe()
  const { logout } = useLogout()

  const userInitials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "AD"

  return (
    <header className="h-16 border-b border-white/10 bg-background/40 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />

        <div className="hidden md:flex items-center relative max-w-md w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search users, courses, reports..."
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors h-10 w-10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
        </Button>

        <div className="h-8 w-px bg-white/10 hidden sm:block mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-10 flex items-center gap-3 px-2 rounded-xl hover:bg-white/5 transition-all">
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarImage src={user?.avatar || ""} alt={user?.fullName || "Admin"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start text-left">
                  <span className="text-sm font-semibold leading-none">{user?.fullName || "Admin User"}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Super Admin</span>
                </div>
              </Button>
            }
          />
          <DropdownMenuContent className="w-64 mt-2 p-2 glass border-white/20" align="end">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-semibold leading-none">{user?.fullName || "Admin User"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || "admin@nexlearn.edu"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <div className="py-1">
              <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
                <Link href="/admin/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Admin Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
                <Link href="/admin/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>System Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
                <Link href="/" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>View Public Site</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => logout()}
              className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer py-2 font-medium"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
