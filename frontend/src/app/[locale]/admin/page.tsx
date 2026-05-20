import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  DollarSign,
  GraduationCap,
  MoreVertical,
  Search,
  Users
} from "lucide-react"

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "24,512",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Active Courses",
      value: "1,240",
      change: "+4.2%",
      trend: "up",
      icon: BookOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Instructors",
      value: "842",
      change: "-1.4%",
      trend: "down",
      icon: GraduationCap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Total Revenue",
      value: "$124,592",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    }
  ]

  const recentUsers = [
    { name: "Nguyen Van A", email: "vana@gmail.com", role: "Student", status: "Active", avatar: "" },
    { name: "Tran Thi B", email: "thib@gmail.com", role: "Instructor", status: "Pending", avatar: "" },
    { name: "Le Van C", email: "vanc@gmail.com", role: "Student", status: "Active", avatar: "" },
    { name: "Pham Thi D", email: "thid@gmail.com", role: "Student", status: "Inactive", avatar: "" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex items-center gap-2">
            <Search className="w-4 h-4" />
            Find something...
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-white/5 bg-white/5 hover:bg-white/[0.08] transition-colors overflow-hidden relative group">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-20 h-20" />
            </div>
            <CardHeader className="pb-2 space-y-0">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className={cn(
                  "font-medium border-none px-0 flex items-center gap-1",
                  stat.trend === 'up' ? "text-emerald-500" : "text-rose-500"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Placeholder */}
        <Card className="lg:col-span-2 border-white/5 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <CardTitle>Growth Analytics</CardTitle>
              <CardDescription>Platform growth and user engagement over the last 30 days.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-4">
              {[40, 60, 45, 90, 65, 85, 40, 50, 75, 95, 60, 80].map((h, i) => (
                <div key={i} className="flex-1 group relative">
                  <div
                    className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-muted-foreground px-1">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
              <span>OCT</span>
              <span>NOV</span>
              <span>DEC</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest users joined the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-white/10 group-hover:border-primary/50 transition-colors">
                    <AvatarFallback className="text-xs bg-primary/5 text-primary">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-medium px-2 py-0 h-5",
                    user.status === 'Active' ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" :
                      user.status === 'Pending' ? "border-amber-500/20 text-amber-500 bg-amber-500/5" :
                        "border-white/10 text-muted-foreground"
                  )}
                >
                  {user.status}
                </Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
              View all users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
