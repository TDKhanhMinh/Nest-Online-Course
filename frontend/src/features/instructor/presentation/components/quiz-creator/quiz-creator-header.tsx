"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface QuizCreatorHeaderProps {
  canSave: boolean;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
  children?: ReactNode;
}

export const QuizCreatorHeader = ({
  canSave,
  isSaving,
  onBack,
  onSave,
  children,
}: QuizCreatorHeaderProps) => {
  const t = useTranslations("QuizCreator");

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("messages.back")}
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-brand-border bg-brand-card/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("settings_desc")}
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <Eye className="mr-2 h-4 w-4" />
              {t("preview")}
            </Button>
            <Button
              onClick={onSave}
              disabled={!canSave || isSaving}
              className="bg-brand-amber font-semibold text-black hover:bg-brand-amber2"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {t("save_quiz")}
            </Button>
          </div>
        </div>

        {children}
      </div>
    </>
  );
};
