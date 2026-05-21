"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileQuestion, Plus, Search, TimerReset } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useInstructorQuizzes } from "../hooks/use-instructor-quizzes";

const InstructorQuizBankView = () => {
  const t = useTranslations("QuizBank");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useInstructorQuizzes({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery.trim() || undefined,
    order: "DESC",
  });

  const quizzes = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button
          asChild
          className="w-full sm:w-auto bg-brand-amber hover:bg-brand-amber2 text-black font-semibold"
        >
          <Link href="/instructor/quizzes/create">
            <Plus className="h-4 w-4 mr-2" />
            {t("create")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-brand-border bg-brand-card/50">
          <CardContent className="p-5 space-y-1">
            <p className="text-sm text-muted-foreground">
              {t("stats.total_quizzes")}
            </p>
            <p className="text-3xl font-bold text-brand-amber">
              {pagination?.itemCount ?? quizzes.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-brand-border bg-brand-card/50">
          <CardContent className="p-5 space-y-1">
            <p className="text-sm text-muted-foreground">
              {t("stats.total_questions")}
            </p>
            <p className="text-3xl font-bold text-brand-amber">
              {quizzes.reduce(
                (total, quiz) => total + quiz.questions.length,
                0,
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="border-brand-border bg-brand-card/50">
          <CardContent className="p-5 space-y-1">
            <p className="text-sm text-muted-foreground">
              {t("stats.avg_attempts")}
            </p>
            <p className="text-3xl font-bold text-brand-amber">
              {quizzes.length > 0
                ? (
                    quizzes.reduce(
                      (total, quiz) => total + quiz.maxAttempts,
                      0,
                    ) / quizzes.length
                  ).toFixed(1)
                : "0"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-brand-border bg-brand-card/50">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>{t("table_title")}</CardTitle>
            <CardDescription>{t("table_desc")}</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("search_placeholder")}
              className="pl-9 bg-brand-bg/50 border-brand-border"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-brand-border overflow-hidden">
            <Table>
              <TableHeader className="bg-brand-bg/40">
                <TableRow>
                  <TableHead>{t("columns.title")}</TableHead>
                  <TableHead>{t("columns.lesson")}</TableHead>
                  <TableHead>{t("columns.questions")}</TableHead>
                  <TableHead>{t("columns.settings")}</TableHead>
                  <TableHead className="text-right">
                    {t("columns.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto h-9 w-24" />
                      </TableCell>
                    </TableRow>
                  ))}

                {!isLoading && isError && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-destructive"
                    >
                      {t("load_error")}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && quizzes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16">
                      <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-amber/10">
                          <FileQuestion className="h-6 w-6 text-brand-amber" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold">
                            {t("empty_title")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("empty_desc")}
                          </p>
                        </div>
                        <Button
                          asChild
                          className="bg-brand-amber hover:bg-brand-amber2 text-black font-semibold"
                        >
                          <Link href="/instructor/quizzes/create">
                            <Plus className="h-4 w-4 mr-2" />
                            {t("create")}
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  quizzes.map((quiz) => (
                    <TableRow key={quiz.id} className="align-top">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold">{quiz.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {quiz.description || t("no_description")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {quiz.lessonId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-brand-border"
                        >
                          {t("question_count", {
                            count: quiz.questions.length,
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary">
                            {t("time_limit", { count: quiz.timeLimit })}
                          </Badge>
                          <Badge variant="secondary">
                            {t("passing_score", { count: quiz.passingScore })}
                          </Badge>
                          <Badge variant="secondary">
                            {t("attempts", { count: quiz.maxAttempts })}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={{
                                pathname: "/instructor/quizzes/create",
                                query: {
                                  quizId: quiz.id,
                                },
                              }}
                            >
                              {t("edit")}
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.pageCount > 1 && (
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {t("pagination.showing", {
                  from: (pagination.page - 1) * pagination.limit + 1,
                  to: Math.min(
                    pagination.page * pagination.limit,
                    pagination.itemCount,
                  ),
                  total: pagination.itemCount,
                })}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    setCurrentPage((previous) => Math.max(previous - 1, 1))
                  }
                >
                  {t("pagination.previous")}
                </Button>
                <div className="rounded-md border border-brand-border px-3 py-1 text-sm">
                  {t("pagination.page", {
                    current: pagination.page,
                    total: pagination.pageCount,
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    setCurrentPage((previous) =>
                      Math.min(previous + 1, pagination.pageCount),
                    )
                  }
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-brand-border bg-brand-card/50">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold">{t("create_hint_title")}</p>
            <p className="text-sm text-muted-foreground">
              {t("create_hint_desc")}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/instructor/quizzes/create">
              <TimerReset className="h-4 w-4 mr-2" />
              {t("create")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorQuizBankView;
