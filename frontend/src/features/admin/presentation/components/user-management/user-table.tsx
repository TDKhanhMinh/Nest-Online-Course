"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  MoreHorizontal, 
  Shield, 
  User as UserIcon, 
  UserCheck, 
  UserMinus, 
  UserX,
  Mail,
  Calendar
} from "lucide-react"
import { User, UserRole } from "../../../../user/domain/user.types"
import { useUpdateUser } from "../../../../user/presentation/hooks/use-users"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface UserTableProps {
  users: User[]
}

export function UserTable({ users }: UserTableProps) {
  const { mutate: updateUser, isPending } = useUpdateUser()

  const handleToggleStatus = (user: User) => {
    updateUser({ 
      id: user.id, 
      data: { isActive: !user.isActive } 
    })
  }

  const handleChangeRole = (user: User, newRole: UserRole) => {
    updateUser({
      id: user.id,
      data: { roles: [newRole] }
    })
  }

  const getRoleBadge = (roles: UserRole[]) => {
    if (roles.includes(UserRole.ADMIN)) {
      return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 gap-1"><Shield className="w-3 h-3" /> Admin</Badge>
    }
    if (roles.includes(UserRole.INSTRUCTOR)) {
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 gap-1"><UserCheck className="w-3 h-3" /> Instructor</Badge>
    }
    return <Badge variant="outline" className="text-muted-foreground gap-1"><UserIcon className="w-3 h-3" /> Student</Badge>
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="w-[300px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white/10 group-hover:border-primary/50 transition-colors">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{user.fullName}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.roles)}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={cn(
                      "font-medium",
                      user.isActive 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}
                  >
                    {user.isActive ? "Active" : "Blocked"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "N/A"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-48 bg-popover border-white/10 shadow-2xl">
                      <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(user)}
                        disabled={isPending}
                        className={cn(
                          "gap-2 cursor-pointer",
                          user.isActive ? "text-rose-500 hover:bg-rose-500/10" : "text-emerald-500 hover:bg-emerald-500/10"
                        )}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        {user.isActive ? "Block User" : "Unblock User"}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground/50">Change Role</DropdownMenuLabel>
                      
                      <DropdownMenuItem 
                        disabled={isPending || user.roles.includes(UserRole.STUDENT)}
                        onClick={() => handleChangeRole(user, UserRole.STUDENT)}
                        className="gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4" /> Set as Student
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        disabled={isPending || user.roles.includes(UserRole.INSTRUCTOR)}
                        onClick={() => handleChangeRole(user, UserRole.INSTRUCTOR)}
                        className="gap-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" /> Set as Instructor
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem 
                        disabled={isPending || user.roles.includes(UserRole.ADMIN)}
                        onClick={() => handleChangeRole(user, UserRole.ADMIN)}
                        className="gap-2 cursor-pointer"
                      >
                        <Shield className="w-4 h-4" /> Set as Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
