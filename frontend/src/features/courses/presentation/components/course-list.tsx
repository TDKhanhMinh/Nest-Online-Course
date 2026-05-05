"use client";

import { useTranslations } from "next-intl";
import { useCourses } from "../hooks/use-courses";
import { BookOpen } from "lucide-react";

export const CourseList = () => {
  const t = useTranslations("Courses");
  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20">
        {t("error")}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {courses?.map((course) => (
        <div
          key={course.id}
          className="flex items-center justify-between p-5 glass rounded-2xl border hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">{course.title}</h4>
              <p className="text-sm text-muted-foreground">
                {t("instructor", { name: course.instructor })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="block font-bold text-primary text-lg">{course.price}</span>
            <button className="text-xs font-semibold text-primary hover:underline">
              {t("detail")}
            </button>
          </div>
        </div>
      ))}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
        <p className="text-xs font-medium text-primary uppercase tracking-wider">
          ✅ {t("arch_badge")}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {t("arch_flow")}
        </p>
      </div>
    </div>
  );
};
