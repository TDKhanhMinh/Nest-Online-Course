"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, CheckCircle, ArrowRight, PlayCircle, Bell, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardView() {
  const t = useTranslations("Dashboard");
  const tHome = useTranslations("HomePage");

  // Mock data
  const stats = [
    {
      label: t("stats.courses_in_progress"),
      value: "4",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: t("stats.completed_courses"),
      value: "12",
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: t("stats.learning_hours"),
      value: "128",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: t("recommended"),
      value: "5",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const ongoingCourses = [
    {
      id: 1,
      title: tHome("course_data.react.title"),
      instructor: tHome("course_data.react.author"),
      progress: 65,
      image: "/images/courses/react.png",
      lastAccessed: "2 hours ago",
    },
    {
      id: 2,
      title: tHome("course_data.ai.title"),
      instructor: tHome("course_data.ai.author"),
      progress: 30,
      image: "/images/courses/ai.png",
      lastAccessed: "Yesterday",
    },
  ];

  const recommendedCourses = [
    {
      id: 3,
      title: tHome("course_data.security.title"),
      instructor: tHome("course_data.security.author"),
      image: "/images/courses/security.png",
      price: "$49.99",
      rating: 4.9,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-slate-900 dark:text-white">
            {t("welcome", { name: "Khanh Minh" })}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {tHome("hero.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative rounded-full border-brand-border bg-brand-bg/50">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-brand-amber rounded-full border-2 border-brand-bg" />
          </Button>
          <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-semibold">
            {t("explore_courses")}
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-brand-border bg-brand-card/50 backdrop-blur-sm hover:shadow-lg transition-all cursor-default">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Ongoing Courses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold font-sora text-slate-900 dark:text-white">
            {t("continue_learning")}
          </h2>
          <Button variant="ghost" className="text-brand-amber hover:text-brand-amber2 hover:bg-brand-amber/10 group">
            {tHome("featured.view_all")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ongoingCourses.map((course) => (
            <Card key={course.id} className="group overflow-hidden border-brand-border bg-brand-card/50 backdrop-blur-sm hover:border-brand-amber/50 transition-all">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-brand-amber text-black border-none">
                      {course.progress}%
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.lastAccessed}
                      </p>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white leading-tight truncate">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {course.instructor}
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="space-y-1">
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                    <Button className="w-full sm:w-auto bg-brand-amber/10 hover:bg-brand-amber text-brand-amber hover:text-black transition-all">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {t("continue_learning")}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommended & Notifications Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recommended */}
        <section className="xl:col-span-2 space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold font-sora text-slate-900 dark:text-white">
            {t("recommended")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden border-brand-border bg-brand-card/50 backdrop-blur-sm group hover:shadow-xl transition-all">
                <div className="relative aspect-video">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white border-none backdrop-blur-sm">
                      ★ {course.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {course.instructor}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="font-bold text-brand-amber">{course.price}</span>
                    <Button variant="ghost" size="sm" className="hover:bg-brand-amber/10 text-brand-amber">
                      {tHome("featured.register")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold font-sora text-slate-900 dark:text-white">
            {t("notifications")}
          </h2>
          <Card className="border-brand-border bg-brand-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-brand-border">
                {[1, 2, 3].map((notif) => (
                  <div key={notif} className="p-4 hover:bg-brand-bg/30 transition-colors flex gap-3 cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-brand-amber/10 flex items-center justify-center shrink-0">
                      <Bell className="h-5 w-5 text-brand-amber" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                        New course content added
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        React & Next.js 14 updated with Server Actions.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full rounded-none h-11 text-slate-500 hover:text-brand-amber">
                View All
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
