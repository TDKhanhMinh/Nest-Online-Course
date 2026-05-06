"use client";

import Image from "next/image";
import { Star, Clock, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "../../domain/course.types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const t = useTranslations("HomePage.featured");
  const tc = useTranslations("Common");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/courses/${course.id}`}>
        <Card className="group h-full overflow-hidden border-brand-border bg-brand-card transition-all hover:border-brand-amber/40 hover:shadow-2xl hover:shadow-black/50">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {course.isBestseller && (
                <Badge className="bg-brand-amber text-black hover:bg-brand-amber border-none text-[10px] uppercase font-bold px-2 py-0.5">
                  {t("bestseller")}
                </Badge>
              )}
              {course.isNew && (
                <Badge className="bg-blue-500 text-white hover:bg-blue-500 border-none text-[10px] uppercase font-bold px-2 py-0.5">
                  {t("newest")}
                </Badge>
              )}
              {course.isHot && (
                <Badge className="bg-red-500 text-white hover:bg-red-500 border-none text-[10px] uppercase font-bold px-2 py-0.5">
                  {t("hot")}
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-4 flex flex-col h-[calc(100%-aspect-video)]">
            <div className="flex-1">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand-amber">
                {course.category}
              </p>
              <h3 className="mb-1.5 font-sora text-[15px] font-bold leading-snug text-slate-900 dark:text-white line-clamp-2">
                {course.title}
              </h3>
              <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">{course.author}</p>

              {/* Meta Stats */}
              <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t("duration", { count: course.duration })}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {t("lessons", { count: course.lessons })}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {t("students", { count: course.students })}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-4 flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3"
                      fill={i < Math.floor(course.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{course.rating}</span>
                <span className="text-xs text-slate-500">({course.reviewCount.toLocaleString()})</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-auto">
              <div className="flex items-baseline gap-1.5">
                <span className="font-sora text-lg font-extrabold text-brand-amber">
                  {course.price.toLocaleString()}đ
                </span>
                {course.originalPrice > course.price && (
                  <span className="text-xs text-slate-500 line-through">
                    {course.originalPrice.toLocaleString()}đ
                  </span>
                )}
              </div>
              <Badge variant="outline" className="h-7 border-brand-amber/50 bg-transparent px-3 text-xs font-semibold text-brand-amber transition-colors group-hover:bg-brand-amber group-hover:text-black">
                {t("register")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Single column, aspect-video thumbnail, touch-friendly tap targets.
// tablet  (md / lg):       2-3 columns grid, image scaling on hover.
// desktop (xl / 2xl):      3-4 columns grid, elevation and shadow animations on hover.
// Interaction:             Cards are fully clickable links, hover states for both image and button.
