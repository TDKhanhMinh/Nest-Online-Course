"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, CheckCircle, ArrowRight, PlayCircle, Bell, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useMe } from "@/features/auth/presentation/hooks/use-auth-hooks";
import { useEnrollmentsQuery } from "../hooks/use-enrollments";
import { usePublicCourses } from "@/features/course/presentation/hooks/use-public-courses";
import { CourseCard } from "@/features/course/presentation/components/course-card";
import { Course, CourseLevel, CourseStatus } from "@/features/course/domain/course.types";

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

  const { data: user } = useMe();
  const { data: enrollments, isLoading: isEnrollmentsLoading } = useEnrollmentsQuery();
  const { data: publicCoursesData, isLoading: isPublicCoursesLoading } = usePublicCourses({
    page: 1,
    limit: 2,
    sortBy: "latest"
  });

  if (isEnrollmentsLoading || isPublicCoursesLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-brand-amber" />
      </div>
    );
  }

  const coursesList = enrollments ?? [];
  const inProgressCourses = coursesList.filter((item) => item.progress < 100);
  const completedCourses = coursesList.filter((item) => item.progress === 100);

  // Compute dynamic stats
  const inProgressCount = inProgressCourses.length;
  const completedCount = completedCourses.length;
  const estimatedHours = Math.round(
    coursesList.reduce((acc, c) => acc + (c.progress / 100) * 10, 0)
  );

  const publicCourses = (publicCoursesData?.courses || []) as Course[];

  const stats = [
    {
      label: t("stats.courses_in_progress"),
      value: inProgressCount.toString(),
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: t("stats.completed_courses"),
      value: completedCount.toString(),
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: t("stats.learning_hours"),
      value: estimatedHours.toString(),
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: t("recommended"),
      value: publicCourses.length.toString(),
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  // Show in-progress courses. If none, show recently enrolled courses as fallback quick links.
  const displayOngoing = inProgressCourses.length > 0 
    ? inProgressCourses.slice(0, 4) 
    : coursesList.slice(0, 2);

  // Fallback recommended courses if catalog is empty
  const fallbackRecommended: Course[] = [
    {
      id: "fallback-1",
      title: "React & Next.js — Toàn tập từ Zero tới Hero",
      description: "Học React và Next.js từ cơ bản đến nâng cao thông qua các dự án thực tế.",
      slug: "react-nextjs-zero-to-hero",
      price: 499000,
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      thumbnailUrl: "/images/courses/react.png",
      instructorId: "instructor-1",
      instructorName: "Nguyễn Văn Khoa · Senior Engineer",
      categoryId: "Frontend",
      categoryName: "Lập trình Web",
      language: "Vietnamese",
      avgRating: 4.8,
      totalReviews: 128,
      totalStudents: 1543,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fallback-2",
      title: "LLM Engineering & Prompt Engineering thực chiến",
      description: "Xây dựng các ứng dụng AI sử dụng các mô hình ngôn ngữ lớn (LLM).",
      slug: "llm-prompt-engineering",
      price: 799000,
      level: CourseLevel.INTERMEDIATE,
      status: CourseStatus.PUBLISHED,
      thumbnailUrl: "/images/courses/ai.png",
      instructorId: "instructor-2",
      instructorName: "Trần Minh Tuấn · AI Lead @ VNG",
      categoryId: "AI",
      categoryName: "AI & Học máy",
      language: "Vietnamese",
      avgRating: 4.9,
      totalReviews: 95,
      totalStudents: 842,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const recommendedCourses = publicCourses.length > 0 ? publicCourses.slice(0, 2) : fallbackRecommended;

  const notifications = [
    {
      id: 1,
      title: "Chào mừng bạn đến với NexLearn!",
      desc: "Khám phá hàng trăm khóa học lập trình và công nghệ chất lượng cao.",
      time: "1 ngày trước",
    },
    {
      id: 2,
      title: "Cập nhật tài liệu mới",
      desc: "Khóa học React & Next.js đã được cập nhật thêm bài học Next.js 15 Server Actions.",
      time: "2 ngày trước",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sora text-slate-900 dark:text-white">
            {t("welcome", { name: user?.fullName || "Student" })}
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
          <Link href="/courses">
            <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-semibold">
              {t("explore_courses")}
            </Button>
          </Link>
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
          <Link href="/my-courses">
            <Button variant="ghost" className="text-brand-amber hover:text-brand-amber2 hover:bg-brand-amber/10 group">
              {tHome("featured.view_all")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {displayOngoing.length === 0 ? (
          <Card className="border border-dashed border-brand-border bg-brand-card/30 p-8 text-center rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              {t("no_courses")}
            </p>
            <Link href="/courses">
              <Button className="bg-brand-amber hover:bg-brand-amber2 text-black font-semibold">
                {t("explore_courses")}
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayOngoing.map((course) => (
              <Card key={course.courseId} className="group overflow-hidden border-brand-border bg-brand-card/50 backdrop-blur-sm hover:border-brand-amber/50 transition-all">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0 overflow-hidden">
                    <Image
                      src={course.thumbnailUrl || "/images/placeholder.png"}
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
                          {course.enrolledAt ? new Date(course.enrolledAt).toLocaleDateString() : "Recently"}
                        </p>
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white leading-tight truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {course.instructorName}
                      </p>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="space-y-1">
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                      <Link href={`/learning/${course.courseId}`} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-brand-amber/10 hover:bg-brand-amber text-brand-amber hover:text-black transition-all">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          {t("continue_learning")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
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
              <CourseCard key={course.id} course={course} />
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
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-brand-bg/30 transition-colors flex gap-3 cursor-pointer">
                    <div className="h-10 w-10 rounded-full bg-brand-amber/10 flex items-center justify-center shrink-0">
                      <Bell className="h-5 w-5 text-brand-amber" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {notif.desc}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/notifications">
                <Button variant="ghost" className="w-full rounded-none h-11 text-slate-500 hover:text-brand-amber">
                  View All
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Stacked cards, full-width buttons, and single column grids.
// tablet  (md / lg):       2 columns grid for statistics and recommended courses.
// desktop (xl / 2xl):      4 columns grid for statistics, and double column layouts for quick links.
// Interaction:             Interactive cards with custom hover and cursor pointer options.
