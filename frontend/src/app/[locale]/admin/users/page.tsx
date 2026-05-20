"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { UserTable } from "@/features/admin/presentation/components/user-management/user-table"
import { useUsers } from "@/features/user/presentation/hooks/use-users"
import { Download, Filter, RefreshCw, Search, Users } from "lucide-react"
import { useState } from "react"

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string[]>([])

  const { data, isLoading, refetch, isRefetching } = useUsers({
    search: search.length >= 2 ? search : undefined
  })

  const users = data?.users || []

  const filteredUsers = users.filter(user => {
    if (roleFilter.length === 0) return true
    return user.roles.some(role => roleFilter.includes(role))
  })

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage user accounts, roles, and platform access.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="border-white/10 hover:bg-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2 hidden sm:flex">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                Filter Roles
                {roleFilter.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                    {roleFilter.length}
                  </span>
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48 bg-popover border-white/10">
            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            {['ADMIN', 'INSTRUCTOR', 'STUDENT'].map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={roleFilter.includes(role)}
                onCheckedChange={(checked) => {
                  setRoleFilter(prev =>
                    checked ? [...prev, role] : prev.filter(r => r !== role)
                  )
                }}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <UserTable users={filteredUsers} />
      )}

      {/* Pagination Footer (Placeholder for now) */}
      {!isLoading && data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <p>Showing {filteredUsers.length} of {data.total} users</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled className="text-xs">Previous</Button>
            <Button variant="ghost" size="sm" disabled className="text-xs">Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
