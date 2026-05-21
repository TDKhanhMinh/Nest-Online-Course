"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface QuestionBankHeaderProps {
  onAddQuestion: () => void;
}

export const QuestionBankHeader = ({
  onAddQuestion,
}: QuestionBankHeaderProps) => {
  const t = useTranslations("QuestionBank");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("all_questions")}</p>
      </div>

      <Button className="w-full sm:w-auto" onClick={onAddQuestion}>
        <Plus className="mr-2 h-4 w-4" />
        {t("add_question")}
      </Button>
    </div>
  );
};
