"use client";

import { AnimatePresence, motion, Reorder } from "framer-motion";
import { GripVertical, Plus, Search, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import type {
  QuestionBankItem,
  QuizQuestionDraft,
} from "./quiz-creator.types";

interface QuizCreatorQuestionsTabProps {
  addSelectedQuestions: () => void;
  effectiveSelectedQuestions: QuizQuestionDraft[];
  filteredQuestionBank: QuestionBankItem[];
  isLoadingQuestionBank: boolean;
  isQuestionBankError: boolean;
  removeQuestion: (id: string) => void;
  searchKeyword: string;
  selectedBankQuestionIds: string[];
  setSearchKeyword: (value: string) => void;
  setSelectedQuestions: (questions: QuizQuestionDraft[]) => void;
  toggleQuestionSelection: (questionId: string, checked: boolean) => void;
  updatePoints: (id: string, nextPoints: number) => void;
}

interface SelectedQuestionCardProps {
  index: number;
  question: QuizQuestionDraft;
  removeQuestion: (id: string) => void;
  updatePoints: (id: string, nextPoints: number) => void;
}

const SelectedQuestionCard = ({
  index,
  question,
  removeQuestion,
  updatePoints,
}: SelectedQuestionCardProps) => {
  const t = useTranslations("QuizCreator");

  return (
    <Reorder.Item
      key={question.id}
      value={question}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group flex items-start gap-3 rounded-lg border border-brand-border bg-brand-bg/50 p-3 sm:gap-4 sm:p-4"
    >
      <div className="mt-1 cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
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
        <p className="text-sm font-medium leading-relaxed">{question.title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {question.content}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="text-right">
          <Label className="text-[10px] uppercase text-muted-foreground">
            {t("messages.points_label")}
          </Label>
          <Input
            type="number"
            min={1}
            className="h-8 w-16 border-brand-border bg-brand-bg text-center"
            value={question.points}
            onChange={(event) =>
              updatePoints(question.id, Math.max(1, Number(event.target.value) || 1))
            }
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10"
          onClick={() => removeQuestion(question.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Reorder.Item>
  );
};

interface QuestionBankListItemProps {
  isAlreadyAdded: boolean;
  isChecked: boolean;
  question: QuestionBankItem;
  toggleQuestionSelection: (questionId: string, checked: boolean) => void;
}

const QuestionBankListItem = ({
  isAlreadyAdded,
  isChecked,
  question,
  toggleQuestionSelection,
}: QuestionBankListItemProps) => {
  const t = useTranslations("QuizCreator");

  return (
    <div className="flex items-start gap-3 rounded-md border border-brand-border p-3 text-xs transition-colors hover:bg-brand-amber/5">
      <Checkbox
        id={`q-bank-${question.id}`}
        checked={isChecked || isAlreadyAdded}
        disabled={isAlreadyAdded}
        onCheckedChange={(checked) =>
          toggleQuestionSelection(question.id, Boolean(checked))
        }
        className="mt-1 border-brand-border data-[state=checked]:bg-brand-amber data-[state=checked]:text-black"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="line-clamp-1 font-medium">{question.title}</p>
          {isAlreadyAdded && (
            <Badge variant="outline" className="border-brand-border text-[10px]">
              {t("messages.already_added")}
            </Badge>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-muted-foreground">
          {question.content}
        </p>
        <p className="mt-1 text-[9px] uppercase text-muted-foreground">
          {question.type}
          {question.difficulty ? ` \u2022 ${question.difficulty}` : ""}
        </p>
      </div>
    </div>
  );
};

export const QuizCreatorQuestionsTab = ({
  addSelectedQuestions,
  effectiveSelectedQuestions,
  filteredQuestionBank,
  isLoadingQuestionBank,
  isQuestionBankError,
  removeQuestion,
  searchKeyword,
  selectedBankQuestionIds,
  setSearchKeyword,
  setSelectedQuestions,
  toggleQuestionSelection,
  updatePoints,
}: QuizCreatorQuestionsTabProps) => {
  const t = useTranslations("QuizCreator");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="border-brand-border bg-brand-card/50 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{t("select_questions")}</CardTitle>
            <CardDescription>
              {t("selected_count", { count: effectiveSelectedQuestions.length })}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" disabled>
            <Plus className="mr-2 h-4 w-4" />
            {t("add_new")}
          </Button>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <Reorder.Group
            axis="y"
            values={effectiveSelectedQuestions}
            onReorder={setSelectedQuestions}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {effectiveSelectedQuestions.map((question, index) => (
                <SelectedQuestionCard
                  key={question.id}
                  index={index}
                  question={question}
                  removeQuestion={removeQuestion}
                  updatePoints={updatePoints}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {effectiveSelectedQuestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border-2 border-dashed border-brand-border py-12 text-center"
            >
              <p className="text-muted-foreground">
                {t("messages.no_selected_questions")}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit border-brand-border bg-brand-card/50">
        <CardHeader>
          <CardTitle className="text-lg">{t("from_bank")}</CardTitle>
          <CardDescription>{t("bank_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder={t("search_bank")}
              className="h-9 border-brand-border bg-brand-bg/50 pl-8 text-sm"
            />
          </div>

          <div className="custom-scrollbar max-h-[300px] space-y-2 overflow-y-auto pr-2 sm:max-h-[400px]">
            {isLoadingQuestionBank &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-md border border-brand-border p-3"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-full" />
                </div>
              ))}

            {!isLoadingQuestionBank && isQuestionBankError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {t("messages.bank_load_failed")}
              </div>
            )}

            {!isLoadingQuestionBank &&
              !isQuestionBankError &&
              filteredQuestionBank.map((question) => (
                <QuestionBankListItem
                  key={question.id}
                  question={question}
                  isChecked={selectedBankQuestionIds.includes(question.id)}
                  isAlreadyAdded={effectiveSelectedQuestions.some(
                    (selectedQuestion) => selectedQuestion.id === question.id,
                  )}
                  toggleQuestionSelection={toggleQuestionSelection}
                />
              ))}

            {!isLoadingQuestionBank &&
              !isQuestionBankError &&
              filteredQuestionBank.length === 0 && (
                <div className="rounded-md border border-brand-border p-4 text-sm text-muted-foreground">
                  {t("messages.no_bank_results")}
                </div>
              )}
          </div>

          <Button
            className="w-full bg-brand-amber font-semibold text-black hover:bg-brand-amber2"
            size="sm"
            onClick={addSelectedQuestions}
            disabled={selectedBankQuestionIds.length === 0}
          >
            {t("add_selected")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
