"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useInstructorCourses } from "@/features/course/presentation/hooks/use-instructor-courses";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Star,
  TrendingUp,
  Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const chartData = [
  { month: "Jan", revenue: 4500, students: 120 },
  { month: "Feb", revenue: 5200, students: 150 },
  { month: "Mar", revenue: 4800, students: 140 },
  { month: "Apr", revenue: 6100, students: 210 },
  { month: "May", revenue: 5900, students: 190 },
  { month: "Jun", revenue: 7200, students: 250 },
  { month: "Jul", revenue: 8500, students: 320 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  students: {
    label: "Students",
    color: "hsl(var(--brand-amber))",
  },
} satisfies ChartConfig;

export const InstructorDashboardView = () => {
  const t = useTranslations("InstructorDashboard");

  const { data: coursesData } = useInstructorCourses();
  const courses = coursesData?.courses || [];

  const totalStudentsCount = '0'
  // courses?.reduce((acc, course) => acc + (course.totalStudents || 0), 0);
  const totalRevenue = '0'
  // = courses?.reduce((acc, course) => acc + ((course.totalStudents || 0) * (course.price || 0)), 0);

  const stats = [
    {
      label: t("overview.total_students"),
      value: totalStudentsCount.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+12%",
      description: "Students joined this month"
    },
    {
      label: t("overview.total_courses"),
      value: courses.length.toString(),
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "0%",
      description: "Active courses on platform"
    },
    {
      label: t("overview.avg_rating"),
      value: "4.8",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "+0.2",
      description: "Average across all courses"
    },
    {
      label: t("overview.revenue"),
      value: `$${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "+18%",
      description: "Total earnings this month"
    },
  ];

  const recentActivities = [
    { id: 1, type: "enrollment", student: "Alex Johnson", course: "React for Beginners", time: "2 hours ago", avatar: "AJ" },
    { id: 2, type: "question", student: "Maria Garcia", course: "Advanced Next.js", time: "4 hours ago", content: "How do I implement dynamic metadata?", avatar: "MG" },
    { id: 3, type: "review", student: "John Smith", course: "UI/UX Design Masterclass", time: "6 hours ago", rating: 5, avatar: "JS" },
    { id: 4, type: "enrollment", student: "Sarah Williams", course: "React for Beginners", time: "1 day ago", avatar: "SW" },
  ];

  const supportRequests = [
    { id: 1, title: "Video playback issue", priority: "high", status: "unanswered", time: "1 hour ago" },
    { id: 2, title: "Course material download link", priority: "medium", status: "unanswered", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 md:px-10 md:py-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-amber/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-sora tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-2 text-slate-400 text-lg max-w-md">
              {t("welcome", { name: "Instructor" })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <Button variant="outline" className="glass border-white/10 text-white hover:bg-white/10 transition-all">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:scale-105">
              <Plus className="mr-2 h-5 w-5" />
              {t("quick_actions.create_course")}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid - Floating over header slightly if possible, but let's keep it clean */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:-mt-10 md:px-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="glass border-brand-border/50 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full opacity-20 group-hover:scale-125 transition-transform`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform shadow-sm`}>
                    <stat.icon size={24} />
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold px-2">
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                  <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Performance Overview Chart */}
        <Card className="lg:col-span-2 border-brand-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                {t("performance_overview")}
              </CardTitle>
              <CardDescription className="mt-1">
                {t("performance_subtitle")}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">Week</Button>
              <Button variant="secondary" size="sm" className="h-8 text-xs font-bold">Month</Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4 flex-1">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-students)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-students)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    dy={10}
                  />
                  <YAxis
                    hide
                    domain={['auto', 'auto']}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="var(--color-students)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions & Support Vertical Stack */}
        <div className="space-y-6">
          {/* Quick Actions Bento */}
          <Card className="border-brand-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Plus className="text-brand-amber" size={20} />
                {t("quick_actions.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-between h-14 border-brand-border/50 hover:bg-brand-amber/5 group transition-all rounded-xl px-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 group-hover:bg-brand-amber/20 group-hover:text-brand-amber transition-colors">
                    <Users size={18} />
                  </div>
                  <span className="font-semibold">{t("quick_actions.view_students")}</span>
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
              <Button variant="outline" className="justify-between h-14 border-brand-border/50 hover:bg-brand-amber/5 group transition-all rounded-xl px-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mr-3 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <TrendingUp size={18} />
                  </div>
                  <span className="font-semibold">{t("quick_actions.payout_settings")}</span>
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Support Bento */}
          <Card className="border-brand-border/50 shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
                  <AlertCircle size={20} />
                  {t("support_requests.title")}
                </CardTitle>
                <Badge className="bg-red-500 text-white border-none rounded-full h-5 w-5 flex items-center justify-center p-0">
                  {supportRequests.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {supportRequests.map((req) => (
                <div key={req.id} className="group cursor-pointer p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-brand-border transition-all shadow-hover">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${req.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      {req.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{req.time}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                    {req.title}
                  </p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs h-9 hover:bg-slate-200/50 dark:hover:bg-white/10 font-bold">
                {t("support_requests.view_all")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section - Modern Timeline Style */}
      <Card className="border-brand-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="text-primary" size={20} />
            {t("recent_activity.title")}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary font-bold text-xs hover:bg-primary/10">
            View Activity Log
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-brand-border/30">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                  <AvatarFallback className={`${activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'question' ? 'bg-amber-100 text-amber-600' :
                      'bg-purple-100 text-purple-600'
                    } font-bold text-xs`}>
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {activity.student}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {activity.type === 'enrollment' ? t("recent_activity.new_enrollment", { student: "", course: activity.course }) :
                      activity.type === 'question' ? t("recent_activity.new_question", { student: "", course: activity.course }) :
                        t("recent_activity.new_review", { student: "", course: activity.course, rating: activity.rating ?? 0 })}
                    <span className="font-bold text-slate-900 dark:text-white ml-1">
                      {activity.course}
                    </span>
                  </p>
                  {activity.content && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 italic text-xs text-slate-500 dark:text-slate-400 border-l-4 border-brand-amber">
                      "{activity.content}"
                    </div>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary rounded-full hover:bg-primary/20">
                    <ArrowUpRight size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Single column stack, stats cards become 2x2 grid at 'sm', full-width buttons.
// tablet  (md / lg):       Bento-box layout with floating stats, 2-column distribution for charts and activities.
// desktop (xl / 2xl):      Spacious multi-panel layout, interactive charts, and rich activity timelines.
// Interaction:             Touch targets optimized (≥44px), glassmorphism hover effects, micro-animations for data entry.
