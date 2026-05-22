"use client";

import { AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Copy,
  Edit,
  Eye,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DifficultyLevel } from "../../../infrastructure/instructor-question.api";
import type { QuestionBankQuestionNode } from "./question-bank.types";
import {
  getQuestionNodeId,
  getQuestionTypeIcon,
} from "./question-bank.utils";

interface QuestionBankTableProps {
  questions: QuestionBankQuestionNode[];
  isLoading: boolean;
  isError: boolean;
  onPreview: (question: QuestionBankQuestionNode) => void;
  onEdit: (question: QuestionBankQuestionNode) => void;
  onDuplicate: (question: QuestionBankQuestionNode) => void;
  onDelete: (questionId: string) => void;
}

const getDifficultyVariant = (difficulty?: DifficultyLevel) => {
  if (difficulty === DifficultyLevel.EASY) {
    return "success" as const;
  }

  if (difficulty === DifficultyLevel.MEDIUM) {
    return "warning" as const;
  }

  return "destructive" as const;
};

export const QuestionBankTable = ({
  questions,
  isLoading,
  isError,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
}: QuestionBankTableProps) => {
  const t = useTranslations("QuestionBank");

  return (
    <div className="rounded-xl border bg-background overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px] w-full">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40%]">{t("table.question")}</TableHead>
              <TableHead className="w-[20%]">{t("table.type")}</TableHead>
              <TableHead className="w-[20%]">{t("table.tags")}</TableHead>
              <TableHead className="w-[10%]">
                {t("table.difficulty")}
              </TableHead>
              <TableHead className="w-[10%] text-right">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-destructive"
                >
                  <AlertCircle className="mx-auto mb-2 h-10 w-10" />
                  <p className="font-semibold">{t("error")}</p>
                </TableCell>
              </TableRow>
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{t("empty.title")}</h3>
                  <p className="mx-auto mt-1 max-w-sm text-muted-foreground">
                    {t("empty.description")}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {questions.map((question) => (
                  <TableRow
                    key={getQuestionNodeId(question)}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 rounded bg-muted p-1">
                          {getQuestionTypeIcon(question?.props?.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-100">
                            {question?.props?.title}
                          </div>
                          <span className="line-clamp-2 text-sm leading-relaxed font-normal text-slate-500">
                            {question?.props?.content}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="capitalize font-normal whitespace-nowrap"
                      >
                        {t(`types.${question?.props?.type}`)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {question.props.tags && question.props.tags.length > 0 ? (
                          question.props.tags.map((tag, index) => (
                            <Badge
                              key={`${tag}-${index}`}
                              variant="outline"
                              className="bg-slate-50 text-[11px]"
                            >
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getDifficultyVariant(question?.props?.difficulty)}
                        className="px-2.5 py-0.5 text-xs font-semibold capitalize"
                      >
                        {t(`difficulty.${question?.props?.difficulty}`)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-black dark:text-white"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onPreview(question)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("preview")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(question)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDuplicate(question)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            {t("duplicate")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(getQuestionNodeId(question))}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
