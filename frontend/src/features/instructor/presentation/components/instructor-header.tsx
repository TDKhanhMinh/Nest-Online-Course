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
import { Bell, Globe, Search } from "lucide-react"

export function InstructorHeader() {
  const { data: user } = useMe()
  const { logout } = useLogout()

  const userInitials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "IN"
  return (
    <header className="h-16 border-b border-white/10 bg-background/40 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />

        <div className="hidden md:flex items-center relative max-w-md w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search courses, students, analytics..."
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          <Globe className="w-4 h-4" />
          <span>English</span>
        </div>

        <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors h-10 w-10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
        </Button>

        <div className="h-8 w-px bg-white/10 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 overflow-hidden border border-white/10 hover:border-primary/20 transition-all hover:scale-105 active:scale-95">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={user?.avatar || ""} alt={user?.fullName || "Instructor"} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          } />
          <DropdownMenuContent className="w-64 mt-2 p-2 glass border-white/20" align="end" >
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-semibold leading-none">{user?.fullName || "Instructor"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || "instructor@antigravity.edu"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <div className="py-1">
              <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
                Billing & Payouts
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
