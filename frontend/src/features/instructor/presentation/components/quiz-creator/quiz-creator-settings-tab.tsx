"use client";

import { motion } from "framer-motion";
import { Clock, Plus, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface QuizCreatorSettingsTabProps {
  resolvedDescription: string;
  resolvedMaxAttempts: number;
  resolvedPassingScore: number;
  resolvedTimeLimit: number;
  resolvedTitle: string;
  setDescription: (value: string) => void;
  setMaxAttempts: (value: number) => void;
  setPassingScore: (value: number) => void;
  setTimeLimit: (value: number) => void;
  setTitle: (value: string) => void;
}

export const QuizCreatorSettingsTab = ({
  resolvedDescription,
  resolvedMaxAttempts,
  resolvedPassingScore,
  resolvedTimeLimit,
  resolvedTitle,
  setDescription,
  setMaxAttempts,
  setPassingScore,
  setTimeLimit,
  setTitle,
}: QuizCreatorSettingsTabProps) => {
  const t = useTranslations("QuizCreator");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-brand-border bg-brand-card/50">
        <CardHeader>
          <CardTitle className="text-xl">{t("settings")}</CardTitle>
          <CardDescription>{t("settings_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quiz-title" className="text-sm font-medium">
                {t("title_label")}
              </Label>
              <Input
                id="quiz-title"
                value={resolvedTitle}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t("title_placeholder")}
                className="border-brand-border bg-brand-bg/50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quiz-description" className="text-sm font-medium">
                {t("description_label")}
              </Label>
              <Textarea
                id="quiz-description"
                value={resolvedDescription}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t("description_placeholder")}
                className="min-h-28 border-brand-border bg-brand-bg/50"
              />
            </div>
          </div>

          <Separator className="bg-brand-border" />

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-amber">
                <Clock className="h-4 w-4" />
                <Label className="font-semibold">{t("time_limit")}</Label>
              </div>
              <Input
                type="number"
                min={1}
                value={resolvedTimeLimit}
                onChange={(event) =>
                  setTimeLimit(Math.max(1, Number(event.target.value) || 1))
                }
                className="border-brand-border bg-brand-bg/50"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-amber">
                <Trophy className="h-4 w-4" />
                <Label className="font-semibold">{t("passing_score")}</Label>
              </div>
              <Input
                type="number"
                min={1}
                value={resolvedPassingScore}
                onChange={(event) =>
                  setPassingScore(Math.max(1, Number(event.target.value) || 1))
                }
                className="border-brand-border bg-brand-bg/50"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-amber">
                <Plus className="h-4 w-4" />
                <Label className="font-semibold">{t("max_attempts")}</Label>
              </div>
              <Input
                type="number"
                min={1}
                value={resolvedMaxAttempts}
                onChange={(event) =>
                  setMaxAttempts(Math.max(1, Number(event.target.value) || 1))
                }
                className="border-brand-border bg-brand-bg/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
