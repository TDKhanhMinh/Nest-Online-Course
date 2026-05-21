"use client";

import { CheckCircle2, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import type { QuestionBankQuestionNode } from "./question-bank.types";

interface QuestionBankPreviewDialogProps {
  open: boolean;
  question: QuestionBankQuestionNode | null;
  onOpenChange: (open: boolean) => void;
}

export const QuestionBankPreviewDialog = ({
  open,
  question,
  onOpenChange,
}: QuestionBankPreviewDialogProps) => {
  const t = useTranslations("QuestionBank");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Eye className="h-5 w-5 text-slate-600" />
            {t("preview")}
          </DialogTitle>
        </DialogHeader>

        {question && (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {question.title}
              </h3>
              <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                {question.content}
              </p>
            </div>

            <div className="flex gap-4">
              <div>
                <span className="block text-xs text-muted-foreground">
                  Difficulty
                </span>
                <Badge className="mt-1 font-semibold uppercase">
                  {question.difficulty}
                </Badge>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">
                  Type
                </span>
                <Badge
                  variant="outline"
                  className="mt-1 border-slate-300 font-semibold uppercase"
                >
                  {question.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="block text-sm font-bold text-slate-700">
                Options & Key
              </Label>
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-1 rounded-lg border p-3 transition-all ${
                    option.isCorrect
                      ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm font-medium">
                      {option.content}
                    </span>
                    {option.isCorrect && (
                      <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-600" />
                    )}
                  </div>

                  {option.explanation && (
                    <p className="mt-1 pl-8 text-xs italic text-slate-500">
                      Explanation: {option.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
