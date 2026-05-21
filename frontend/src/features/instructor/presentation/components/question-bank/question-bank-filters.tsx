"use client";

import { ListFilter, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { QuestionType } from "../../../infrastructure/instructor-question.api";

interface QuestionBankFiltersProps {
  searchQuery: string;
  selectedType: string;
  onSearchQueryChange: (value: string) => void;
  onSelectedTypeChange: (value: string) => void;
  onRefresh: () => void;
}

export const QuestionBankFilters = ({
  searchQuery,
  selectedType,
  onSearchQueryChange,
  onSelectedTypeChange,
  onRefresh,
}: QuestionBankFiltersProps) => {
  const t = useTranslations("QuestionBank");

  return (
    <Card className="border-none bg-muted/30 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              className="border-none bg-background pl-9 shadow-sm"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select
              value={selectedType}
              onValueChange={(value) => onSelectedTypeChange(value || "all")}
            >
              <SelectTrigger className="w-[200px] border-none bg-background shadow-sm">
                <SelectValue placeholder={t("all_types")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all_types")}</SelectItem>
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

            <Button
              variant="outline"
              size="icon"
              className="border-none bg-background shadow-sm"
              onClick={onRefresh}
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
