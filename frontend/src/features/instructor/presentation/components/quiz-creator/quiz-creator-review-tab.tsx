"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  QuizQuestionDraft,
  QuizValidationItem,
} from "./quiz-creator.types";

interface QuizCreatorReviewTabProps {
  canSave: boolean;
  handleSaveQuiz: () => void;
  isSaving: boolean;
  questions: QuizQuestionDraft[];
  questionCount: number;
  resolvedPassingScore: number;
  resolvedTimeLimit: number;
  totalPoints: number;
  validationItems: QuizValidationItem[];
}

export const QuizCreatorReviewTab = ({
  canSave,
  handleSaveQuiz,
  isSaving,
  questions,
  questionCount,
  resolvedPassingScore,
  resolvedTimeLimit,
  totalPoints,
  validationItems,
}: QuizCreatorReviewTabProps) => {
  const t = useTranslations("QuizCreator");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-brand-border bg-brand-card/50">
        <CardHeader>
          <CardTitle className="text-xl">{t("overview")}</CardTitle>
          <CardDescription>{t("overview_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div className="space-y-1 rounded-xl border border-brand-amber/20 bg-brand-amber/10 p-4">
              <p className="text-2xl font-bold text-brand-amber">
                {questionCount}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("messages.questions_stat")}
              </p>
            </div>
            <div className="space-y-1 rounded-xl border border-brand-amber/20 bg-brand-amber/10 p-4">
              <p className="text-2xl font-bold text-brand-amber">
                {totalPoints}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("messages.total_points")}
              </p>
            </div>
            <div className="space-y-1 rounded-xl border border-brand-amber/20 bg-brand-amber/10 p-4">
              <p className="text-2xl font-bold text-brand-amber">
                {resolvedTimeLimit}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("stat_minutes")}
              </p>
            </div>
            <div className="space-y-1 rounded-xl border border-brand-amber/20 bg-brand-amber/10 p-4">
              <p className="text-2xl font-bold text-brand-amber">
                {resolvedPassingScore}%
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("stat_pass_score")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {t("validation_summary")}
            </h3>
            <ul className="space-y-3">
              {validationItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      item.valid ? "bg-emerald-500/20" : "bg-amber-500/20"
                    }`}
                  >
                    {item.valid ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                    )}
                  </div>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t("select_questions")}</h3>
            {questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-xl border border-brand-border bg-brand-bg/40 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-brand-border text-[10px] uppercase text-brand-amber"
                          >
                            {question.type}
                          </Badge>
                          <span className="text-xs font-medium sm:text-sm">
                            {t("messages.question_index", { index: index + 1 })}
                          </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">
                          {question.title}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {question.content}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {t("messages.points_label")}: {question.points}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-brand-border py-8 text-center text-sm text-muted-foreground">
                {t("messages.no_selected_questions")}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-brand-amber/20 bg-brand-amber/5 p-6 sm:flex-row">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold">{t("ready_title")}</p>
              <p className="text-sm text-muted-foreground">{t("ready_desc")}</p>
            </div>
            <Button
              size="lg"
              onClick={handleSaveQuiz}
              disabled={!canSave || isSaving}
              className="w-full bg-brand-amber px-12 font-bold text-black hover:bg-brand-amber2 sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {t("save_quiz")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
