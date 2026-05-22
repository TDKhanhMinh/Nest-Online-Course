"use client";

import { AlertCircle, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  DifficultyLevel,
  QuestionType,
  type QuestionOptionDTO,
} from "../../../infrastructure/instructor-question.api";
import type {
  QuestionBankFormState,
  QuestionBankQuestionNode,
} from "./question-bank.types";

interface QuestionBankFormDialogProps {
  open: boolean;
  editingQuestion: QuestionBankQuestionNode | null;
  formState: QuestionBankFormState;
  validationErrors: string[];
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTypeChange: (value: QuestionType) => void;
  onDifficultyChange: (value: DifficultyLevel) => void;
  onTagsChange: (value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onOptionChange: (
    index: number,
    field: keyof QuestionOptionDTO,
    value: boolean | string,
  ) => void;
  onSave: () => void;
}

export const QuestionBankFormDialog = ({
  open,
  editingQuestion,
  formState,
  validationErrors,
  isSaving,
  onOpenChange,
  onTitleChange,
  onContentChange,
  onTypeChange,
  onDifficultyChange,
  onTagsChange,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onSave,
}: QuestionBankFormDialogProps) => {
  const t = useTranslations("QuestionBank");
  const isTrueFalse = formState.type === QuestionType.TRUE_FALSE;
  const canAddOption = !isTrueFalse;
  const canRemoveOption = !isTrueFalse && formState.options.length > 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[90vh] max-w-[700px] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingQuestion ? t("add_modal.edit_title") : t("add_modal.title")}
          </DialogTitle>
          <DialogDescription>
            Provide precise attributes, description, and list of options for the
            quiz creators to consume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="form-title" className="text-sm font-semibold">
              {t("add_modal.question_title")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="form-title"
              placeholder={t("add_modal.question_title_placeholder")}
              value={formState.title}
              onChange={(event) => onTitleChange(event.target.value)}
              className="border-slate-300 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="form-content" className="text-sm font-semibold">
              {t("add_modal.question_content")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="form-content"
              rows={3}
              placeholder={t("add_modal.question_content_placeholder")}
              value={formState.content}
              onChange={(event) => onContentChange(event.target.value)}
              className="border-slate-300 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="form-type" className="text-sm font-semibold">
                {t("add_modal.type")}
              </Label>
              <Select
                value={formState.type}
                onValueChange={(value) => onTypeChange(value as QuestionType)}
              >
                <SelectTrigger id="form-type" className="border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={QuestionType.SINGLE_CHOICE}>
                    {t("types.SINGLE_CHOICE")}
                  </SelectItem>
                  <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                    {t("types.MULTIPLE_CHOICE")}
                  </SelectItem>
                  <SelectItem value={QuestionType.TRUE_FALSE}>
                    {t("types.TRUE_FALSE")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="form-difficulty"
                className="text-sm font-semibold"
              >
                {t("add_modal.difficulty")}
              </Label>
              <Select
                value={formState.difficulty}
                onValueChange={(value) =>
                  onDifficultyChange(value as DifficultyLevel)
                }
              >
                <SelectTrigger
                  id="form-difficulty"
                  className="border-slate-300"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DifficultyLevel.EASY}>
                    {t("difficulty.EASY")}
                  </SelectItem>
                  <SelectItem value={DifficultyLevel.MEDIUM}>
                    {t("difficulty.MEDIUM")}
                  </SelectItem>
                  <SelectItem value={DifficultyLevel.HARD}>
                    {t("difficulty.HARD")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="form-tags" className="text-sm font-semibold">
              {t("add_modal.tags")}
            </Label>
            <Input
              id="form-tags"
              placeholder={t("add_modal.tags_placeholder")}
              value={formState.tags}
              onChange={(event) => onTagsChange(event.target.value)}
              className="border-slate-300 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold text-slate-800 dark:text-slate-100">
                {t("add_modal.options_title")}
              </Label>
              {canAddOption && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddOption}
                  className="h-8 border-dashed border-emerald-600 text-xs text-emerald-600 hover:bg-emerald-50"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {t("add_modal.add_option")}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {formState.options.map((option, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg border bg-slate-50/50 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-2 flex shrink-0 items-center space-x-2">
                      <Checkbox
                        id={`correct-${index}`}
                        checked={option.isCorrect}
                        onCheckedChange={(checked) =>
                          onOptionChange(index, "isCorrect", Boolean(checked))
                        }
                        className="border-slate-400 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                      />
                      <Label
                        htmlFor={`correct-${index}`}
                        className="cursor-pointer text-xs font-semibold whitespace-nowrap text-slate-600"
                      >
                        {t("add_modal.correct_answer")}
                      </Label>
                    </div>

                    <Input
                      placeholder={t("add_modal.option_placeholder")}
                      value={option.content}
                      onChange={(event) =>
                        onOptionChange(index, "content", event.target.value)
                      }
                      disabled={isTrueFalse}
                      className="h-9 flex-1 border-slate-300 bg-white text-sm"
                    />

                    {canRemoveOption && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveOption(index)}
                        className="h-9 w-9 text-slate-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="pl-6">
                    <Input
                      placeholder={t("add_modal.explanation_placeholder")}
                      value={option.explanation || ""}
                      onChange={(event) =>
                        onOptionChange(index, "explanation", event.target.value)
                      }
                      className="h-8 border-slate-200 bg-white text-xs text-slate-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="space-y-1 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Validation Errors</span>
              </div>
              <ul className="list-disc space-y-0.5 pl-5 text-xs">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("add_modal.cancel")}
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={validationErrors.length > 0 || isSaving}
            className="bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
          >
            {isSaving ? t("add_modal.saving") : t("add_modal.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
