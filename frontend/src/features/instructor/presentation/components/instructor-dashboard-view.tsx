"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  Clock,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  Users
} from "lucide-react";
import { useTranslations } from "next-intl";

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

export const InstructorDashboardView = () => {
  const t = useTranslations("InstructorDashboard");

  // Mock data for the dashboard
  const stats = [
    { label: t("overview.total_students"), value: "1,248", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
    { label: t("overview.total_courses"), value: "6", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10", trend: "0%" },
    { label: t("overview.avg_rating"), value: "4.8", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+0.2" },
    { label: t("overview.revenue"), value: "$12,450", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+18%" },
  ];

  const recentActivities = [
    { id: 1, type: "enrollment", student: "Alex Johnson", course: "React for Beginners", time: "2 hours ago" },
    { id: 2, type: "question", student: "Maria Garcia", course: "Advanced Next.js", time: "4 hours ago", content: "How do I implement dynamic metadata?" },
    { id: 3, type: "review", student: "John Smith", course: "UI/UX Design Masterclass", time: "6 hours ago", rating: 5 },
    { id: 4, type: "enrollment", student: "Sarah Williams", course: "React for Beginners", time: "1 day ago" },
  ];

  const supportRequests = [
    { id: 1, title: "Video playback issue", priority: "high", status: "unanswered", time: "1 hour ago" },
    { id: 2, title: "Course material download link", priority: "medium", status: "unanswered", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sora">
            {t("title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t("welcome", { name: "Instructor" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-brand-border">
            <Clock className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            {t("quick_actions.create_course")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-brand-border bg-brand-card/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                    {stat.trend}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="text-brand-amber" size={20} />
              {t("recent_activity.title")}
            </h2>
            <Button variant="ghost" size="sm" className="text-brand-amber text-xs">
              View All
            </Button>
          </div>

          <Card className="border-brand-border bg-brand-card/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-brand-border">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className={`mt-1 p-2 rounded-full ${activity.type === 'enrollment' ? 'bg-blue-500/10 text-blue-500' :
                        activity.type === 'question' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-purple-500/10 text-purple-500'
                      }`}>
                      {activity.type === 'enrollment' ? <Users size={16} /> :
                        activity.type === 'question' ? <MessageSquare size={16} /> :
                          <Star size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {activity.type === 'enrollment' ? t("recent_activity.new_enrollment", { student: activity.student, course: activity.course }) :
                          activity.type === 'question' ? t("recent_activity.new_question", { student: activity.student, course: activity.course }) :
                            t("recent_activity.new_review", { student: activity.student, course: activity.course, rating: activity.rating ?? 0 })}
                      </p>
                      {activity.content && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic line-clamp-1 italic">
                          "{activity.content}"
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <ArrowUpRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support & Quick Actions */}
        <div className="space-y-8">
          {/* Support Requests */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              {t("support_requests.title")}
              <Badge className="ml-2 bg-red-500/10 text-red-600 border-none px-1.5 h-5">
                {supportRequests.length}
              </Badge>
            </h2>
            <Card className="border-brand-border bg-brand-card/50">
              <CardContent className="p-4 space-y-4">
                {supportRequests.map((req) => (
                  <div key={req.id} className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{req.priority}</span>
                      <span className="text-[10px] text-slate-500">{req.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-brand-amber transition-colors">
                      {req.title}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-brand-border text-xs h-9">
                  {t("support_requests.view_all")}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={20} />
              {t("quick_actions.title")}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start h-12 border-brand-border hover:bg-brand-amber/5 group transition-all">
                <Users className="mr-3 h-5 w-5 text-slate-400 group-hover:text-brand-amber" />
                {t("quick_actions.view_students")}
              </Button>
              <Button variant="outline" className="justify-start h-12 border-brand-border hover:bg-brand-amber/5 group transition-all">
                <TrendingUp className="mr-3 h-5 w-5 text-slate-400 group-hover:text-brand-amber" />
                {t("quick_actions.payout_settings")}
              </Button>
              <Button variant="outline" className="justify-start h-12 border-brand-border hover:bg-brand-amber/5 group transition-all">
                <MessageSquare className="mr-3 h-5 w-5 text-slate-400 group-hover:text-brand-amber" />
                Communications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
