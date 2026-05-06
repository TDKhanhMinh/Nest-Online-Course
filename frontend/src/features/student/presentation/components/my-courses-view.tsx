"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/features/course/domain/course.types";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Play, Search, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

interface MyCourse extends Course {
  progress: number;
  lastAccessed: string;
}

const MOCK_MY_COURSES: MyCourse[] = [
  {
    id: "react-1",
    title: "React & Next.js 14 — Complete from Zero to Hero",
    slug: "react-nextjs-complete",
    author: "Khoa Nguyen",
    category: "Frontend",
    thumbnail: "/images/courses/react.png",
    rating: 4.9,
    reviewCount: 3241,
    price: 599000,
    originalPrice: 1299000,
    duration: 42,
    lessons: 186,
    students: 12400,
    level: "intermediate",
    progress: 45,
    lastAccessed: "2024-05-20",
  },
  {
    id: "ai-1",
    title: "LLM Engineering & Prompt Engineering in Practice",
    slug: "llm-prompt-engineering",
    author: "Tuan Tran",
    category: "AI & Data Science",
    thumbnail: "/images/courses/ai.png",
    rating: 4.8,
    reviewCount: 1876,
    price: 799000,
    originalPrice: 1499000,
    duration: 28,
    lessons: 124,
    students: 8700,
    level: "advanced",
    progress: 10,
    lastAccessed: "2024-05-18",
  },
  {
    id: "security-1",
    title: "Ethical Hacking & Penetration Testing for Beginners",
    slug: "ethical-hacking-beginners",
    author: "Dung Le",
    category: "Cybersecurity",
    thumbnail: "/images/courses/security.png",
    rating: 4.7,
    reviewCount: 987,
    price: 699000,
    originalPrice: 1199000,
    duration: 36,
    lessons: 158,
    students: 5200,
    level: "beginner",
    progress: 100,
    lastAccessed: "2024-05-10",
  },
];

export function MyCoursesView() {
  const t = useTranslations("MyCourses");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = MOCK_MY_COURSES.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "in_progress" && course.progress < 100 && course.progress > 0) ||
      (activeTab === "completed" && course.progress === 100);

    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-sora text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Welcome back! You have {MOCK_MY_COURSES.length} courses in your library.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t("search_placeholder")}
            className="pl-10 bg-brand-bg/50 border-brand-border focus-visible:ring-brand-amber/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="bg-brand-bg/50 border border-brand-border p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black">
            {t("tabs.all")}
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black">
            {t("tabs.in_progress")}
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black">
            {t("tabs.completed")}
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black">
            {t("tabs.wishlist")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group flex h-full flex-col overflow-hidden border-brand-border bg-brand-card transition-all hover:border-brand-amber/40 hover:shadow-2xl hover:shadow-black/50">
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:opacity-0" />

                  {/* Progress Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <motion.div
                      className="h-full bg-brand-amber"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <Link href={`/learning/${course.id}`}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-amber text-black shadow-xl ring-4 ring-brand-amber/20">
                        <Play className="ml-1 h-6 w-6 fill-current" />
                      </div>
                    </Link>
                  </div>
                </div>

                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="mb-4 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-amber">
                        {course.category}
                      </span>
                      {course.progress === 100 && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                          <Trophy className="mr-1 h-3 w-3" />
                          COMPLETED
                        </Badge>
                      )}
                    </div>
                    <h3 className="line-clamp-2 font-sora text-lg font-bold leading-tight text-slate-900 dark:text-white group-hover:text-brand-amber transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{course.author}</p>
                  </div>

                  {/* Progress Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {t("progress", { percent: course.progress })}
                      </span>
                      <span className="text-xs text-slate-500">
                        {course.lessons} lessons
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />

                    <div className="pt-2">
                      <Link href={`/learning/${course.id}`} className="w-full">
                        <Button
                          className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
                          variant="default"
                        >
                          {course.progress === 100 ? "Review Course" : course.progress > 0 ? t("continue") : t("start")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCourses.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-bg border border-brand-border">
              <BookOpen className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t("empty")}</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              {activeTab === "wishlist"
                ? "You haven't added any courses to your wishlist yet."
                : "Try searching with different keywords or explore our catalog."}
            </p>
            <Link href="/courses" className="mt-6">
              <Button className="bg-brand-amber text-black hover:bg-brand-amber/90">
                {t("explore")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Single column cards, full-width search and buttons.
// tablet  (md / lg):       2-3 columns grid, header layout shifts to row.
// desktop (xl / 2xl):      3 columns grid, maximum whitespace and hover animations.
// Interaction:             Play button overlay on hover, progress bar syncs with state, animated filtering.
