"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";

interface QuizCreatorContextPanelProps {
  courseId: string;
  hasActiveQuiz: boolean;
  isLoadingQuizDetail: boolean;
  isQuizDetailError: boolean;
  lessonContextType?: string;
  quizId: string;
  resolvedLessonId: string;
  setCourseId: (value: string) => void;
  setLessonId: (value: string) => void;
}

export const QuizCreatorContextPanel = ({
  courseId,
  hasActiveQuiz,
  isLoadingQuizDetail,
  isQuizDetailError,
  lessonContextType,
  quizId,
  resolvedLessonId,
  setCourseId,
  setLessonId,
}: QuizCreatorContextPanelProps) => {
  const t = useTranslations("QuizCreator");

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("lesson_id_label")}
          </p>
          <Input
            value={resolvedLessonId}
            onChange={(event) => setLessonId(event.target.value)}
            placeholder={t("missing_lesson_id")}
            disabled={hasActiveQuiz}
            className="mt-2 border-brand-border bg-brand-bg/60"
          />
        </div>
        <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("course_scope_label")}
          </p>
          <Input
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            placeholder={t("messages.all_courses_scope")}
            className="mt-2 border-brand-border bg-brand-bg/60"
          />
        </div>
        <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("messages.sync_status")}
          </p>
          <p className="mt-1 text-sm font-medium">
            {hasActiveQuiz ? t("messages.synced") : t("messages.pending_sync")}
          </p>
        </div>
      </div>

      {quizId && isLoadingQuizDetail && (
        <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3 text-sm text-muted-foreground">
          {t("messages.detail_loading")}
        </div>
      )}

      {quizId && isQuizDetailError && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
          <p>{t("messages.detail_load_failed")}</p>
        </div>
      )}

      {lessonContextType && lessonContextType !== "quiz" && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
          <p>{t("messages.lesson_type_warning", { type: lessonContextType })}</p>
        </div>
      )}

      {!hasActiveQuiz && resolvedLessonId && !quizId && (
        <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3 text-sm text-muted-foreground">
          {t("messages.first_sync_notice")}
        </div>
      )}
    </>
  );
};
