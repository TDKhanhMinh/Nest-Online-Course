"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, Rocket, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

interface CourseBuilderHeaderProps {
  courseTitle: string;
  showSettings: boolean;
  onToggleSettings: () => void;
}

export const CourseBuilderHeader = ({
  courseTitle,
  showSettings,
  onToggleSettings,
}: CourseBuilderHeaderProps) => {
  const t = useTranslations("CourseBuilder");

  return (
    <header className="border-b bg-background px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Link href="/instructor/courses">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t("back_to_courses")}</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md">
          {courseTitle}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={showSettings ? "secondary" : "outline"}
          size="sm"
          className="hidden sm:flex"
          onClick={onToggleSettings}
        >
          <Settings className="h-4 w-4 mr-2" />
          {showSettings ? "Curriculum" : "Settings"}
        </Button>
        <Button size="sm">
          <Rocket className="h-4 w-4 mr-2" />
          {t("publish")}
        </Button>
      </div>
    </header>
  );
};
