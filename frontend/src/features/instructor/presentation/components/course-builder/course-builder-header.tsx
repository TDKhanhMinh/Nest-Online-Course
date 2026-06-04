"use client";

import { Button } from "@/components/ui/button";
import { CourseStatus } from "@/features/course/domain/course.types";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, Rocket, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

interface CourseBuilderHeaderProps {
  courseTitle: string;
  courseStatus: CourseStatus;
  showSettings: boolean;
  isPublishing: boolean;
  onToggleSettings: () => void;
  onPublish: () => void;
}

export const CourseBuilderHeader = ({
  courseTitle,
  courseStatus,
  showSettings,
  isPublishing,
  onToggleSettings,
  onPublish,
}: CourseBuilderHeaderProps) => {
  const t = useTranslations("CourseBuilder");
  const canSubmitForReview = courseStatus === CourseStatus.DRAFT;
  const publishLabel =
    courseStatus === CourseStatus.PENDING_APPROVAL
      ? t("status.pending_approval")
      : isPublishing
        ? t("submitting_for_review")
        : t("submit_for_review");

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
        <Button
          size="sm"
          disabled={!canSubmitForReview || isPublishing}
          onClick={onPublish}
        >
          <Rocket className="h-4 w-4 mr-2" />
          {publishLabel}
        </Button>
      </div>
    </header>
  );
};
