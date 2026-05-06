"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Course } from "../../domain/course.types";
import { CourseCard } from "./course-card";
import { CourseFilter } from "./course-filter";

const MOCK_COURSES: Course[] = [
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
    isBestseller: true,
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
    isNew: true,
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
    isHot: true,
  },
];

export function CatalogView() {
  const t = useTranslations("CourseCatalog");
  const tc = useTranslations("Common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  // Sync state with URL when params change
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.author.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !categoryParam || course.category === categoryParam;

      return matchesSearch && matchesCategory;
    });
  }, [query, categoryParam]);

  const clearFilters = () => {
    setSearchQuery("");
    router.push(pathname);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header & Search */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="font-sora text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {query ? t("search_results", { count: filteredCourses.length, query }) : t("all_results", { count: filteredCourses.length })}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-amber transition-colors" />
            <Input
              placeholder={tc("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-brand-border bg-brand-card/50 focus-visible:ring-brand-amber"
            />
          </form>

          <div className="flex gap-2">
            <div className="hidden lg:block w-56">
              <Select defaultValue="newest">
                <SelectTrigger className="h-12 border-brand-border bg-brand-card/50">
                  <SelectValue placeholder={t("sort.label")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                  <SelectItem value="popular">{t("sort.popular")}</SelectItem>
                  <SelectItem value="price_low">{t("sort.price_low")}</SelectItem>
                  <SelectItem value="price_high">{t("sort.price_high")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile/Tablet Filter Trigger */}
            <Sheet>
              <SheetTrigger>
                <Button variant="outline" className="lg:hidden h-12 gap-2 border-brand-border bg-brand-card/50">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("filters.title")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md bg-brand-bg border-brand-border overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left font-sora">{t("filters.title")}</SheetTitle>
                  <SheetDescription className="text-left">
                    Refine your search with these filters.
                  </SheetDescription>
                </SheetHeader>
                <CourseFilter />
                <div className="mt-8 pt-6 border-t border-brand-border">
                  <SheetTrigger >
                    <Button className="w-full bg-brand-amber text-black hover:bg-brand-amber2 font-bold h-12">
                      Show Results
                    </Button>
                  </SheetTrigger>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sora font-bold text-lg">{t("filters.title")}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-xs text-brand-amber hover:bg-transparent"
              >
                {t("filters.clear_all")}
              </Button>
            </div>
            <CourseFilter />
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto w-20 h-20 bg-brand-amber/10 rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-brand-amber" />
              </div>
              <h3 className="font-sora text-xl font-bold mb-2">{t("empty.title")}</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">{t("empty.description")}</p>
              <Button
                onClick={clearFilters}
                className="bg-brand-amber text-black hover:bg-brand-amber2"
              >
                {t("empty.button")}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Full width search and filter trigger. Filters in a Sheet. Single column grid.
// tablet  (md / lg):       Grid 2-col. Search bar horizontal. Sorting visible.
// desktop (xl / 2xl):      Sticky sidebar filters. Grid 3-col. Staggered reveal animations.
// Interaction:             Real-time search feedback (simulated). Smooth sheet transitions.
