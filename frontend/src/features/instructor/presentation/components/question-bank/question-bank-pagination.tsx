"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import type { PaginationMeta } from "../../../infrastructure/instructor-question.api";

interface QuestionBankPaginationProps {
  pagination: PaginationMeta;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const QuestionBankPagination = ({
  pagination,
  currentPage,
  itemsPerPage,
  onPageChange,
}: QuestionBankPaginationProps) => {
  const t = useTranslations("QuestionBank");

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t bg-muted/10 p-4 sm:flex-row">
      <span className="text-sm text-slate-500">
        {t("pagination.showing", {
          from: (currentPage - 1) * itemsPerPage + 1,
          to: Math.min(currentPage * itemsPerPage, pagination.itemCount),
          total: pagination.itemCount,
        })}
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={!pagination.hasPreviousPage}
          className="h-8 px-3"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("pagination.previous")}
        </Button>

        <div className="px-2 text-sm font-medium">
          {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
          {pagination.pageCount}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPageChange(Math.min(currentPage + 1, pagination.pageCount))
          }
          disabled={!pagination.hasNextPage}
          className="h-8 px-3"
        >
          {t("pagination.next")}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
