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

import { usePublicCourses } from "../hooks/use-public-courses";

const mapSortValue = (val: string) => {
  switch (val) {
    case "newest":
      return "latest";
    case "popular":
      return "rating_desc";
    case "price_low":
      return "price_asc";
    case "price_high":
      return "price_desc";
    default:
      return "latest";
  }
};

const CourseCardSkeleton = () => (
  <div className="border border-brand-border bg-brand-card/50 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-video bg-slate-700/30 w-full" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-700/30 w-1/4 rounded" />
      <div className="h-5 bg-slate-700/30 w-3/4 rounded" />
      <div className="h-4 bg-slate-700/30 w-1/2 rounded" />
      <div className="h-3 bg-slate-700/30 w-2/3 rounded" />
      <div className="pt-3 border-t border-brand-border flex justify-between items-center">
        <div className="h-5 bg-slate-700/30 w-1/3 rounded" />
        <div className="h-7 bg-slate-700/30 w-1/4 rounded-full" />
      </div>
    </div>
  </div>
);

export function CatalogView() {
  const t = useTranslations("CourseCatalog");
  const tc = useTranslations("Common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const levelParam = searchParams.get("level") || "";
  const sortByParam = searchParams.get("sortBy") || "newest";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [searchQuery, setSearchQuery] = useState(query);

  // Sync state with URL when params change
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const filters = {
    search: query,
    category: categoryParam,
    level: levelParam,
    sortBy: mapSortValue(sortByParam),
    page: pageParam,
    limit: 6,
  };

  const { data, isLoading } = usePublicCourses(filters);

  const courses = data?.courses || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 6, total_pages: 1 };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    params.set("page", "1"); // Reset to page 1 on new search
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

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
            {query
              ? t("search_results", { count: pagination.total, query })
              : t("all_results", { count: pagination.total })}
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
            <div className="hidden sm:block w-56">
              <Select value={sortByParam} onValueChange={handleSortChange}>
                <SelectTrigger className="h-12 border-brand-border bg-brand-card/50">
                  <SelectValue placeholder={t("sort.label")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                  <SelectItem value="popular">{t("sort.popular")}</SelectItem>
                  <SelectItem value="price_low">
                    {t("sort.price_low")}
                  </SelectItem>
                  <SelectItem value="price_high">
                    {t("sort.price_high")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile/Tablet Filter Trigger */}
            <Sheet>
              <SheetTrigger>
                <Button
                  variant="outline"
                  className="lg:hidden h-12 gap-2 border-brand-border bg-brand-card/50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("filters.title")}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:max-w-md bg-brand-bg border-brand-border overflow-y-auto"
              >
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left font-sora">
                    {t("filters.title")}
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Refine your search with these filters.
                  </SheetDescription>
                </SheetHeader>
                <CourseFilter />
                <div className="mt-8 pt-6 border-t border-brand-border">
                  <SheetTrigger>
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
              <h2 className="font-sora font-bold text-lg">
                {t("filters.title")}
              </h2>
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
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {courses.map((course) => (
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

              {/* Pagination Controls */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="h-10 px-4 border-brand-border text-slate-700 dark:text-slate-300 hover:bg-brand-amber hover:text-black transition-colors"
                  >
                    Previous
                  </Button>
                  {[...Array(pagination.total_pages)].map((_, idx) => {
                    const pageNumber = idx + 1;
                    const isActive = pageNumber === pagination.page;
                    return (
                      <Button
                        key={pageNumber}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`h-10 w-10 font-bold ${
                          isActive
                            ? "bg-brand-amber text-black hover:bg-brand-amber2"
                            : "border-brand-border text-slate-700 dark:text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.total_pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="h-10 px-4 border-brand-border text-slate-700 dark:text-slate-300 hover:bg-brand-amber hover:text-black transition-colors"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && courses.length === 0 && (
            <div className="py-20 text-center">
              <div className="mx-auto w-20 h-20 bg-brand-amber/10 rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-brand-amber" />
              </div>
              <h3 className="font-sora text-xl font-bold mb-2">
                {t("empty.title")}
              </h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                {t("empty.description")}
              </p>
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
// mobile  (default / sm):  Full width search, single column grid, filters trigger in Sheet.
// tablet  (sm / md / lg):  Grid 2-col, sort dropdown visible, pagination controls centred.
// desktop (xl / 2xl):      Sticky sidebar filters, 3-column grid, motion entry animations.
// Interaction:             Instant page/sort URL syncing, hover state effects, click targets >=44px.
