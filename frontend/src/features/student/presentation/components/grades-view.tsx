"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen,
  Trophy,
  Filter,
  Search,
  FileText,
  HelpCircle,
  MoreHorizontal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Data
const MOCK_GRADES = [
  {
    id: "g1",
    courseId: "c1",
    courseName: "React & Next.js 14 — Complete from Zero to Hero",
    assessmentName: "React Core Concepts Quiz",
    type: "quiz",
    score: 85,
    maxScore: 100,
    status: "passed",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "g2",
    courseId: "c1",
    courseName: "React & Next.js 14 — Complete from Zero to Hero",
    assessmentName: "Build a To-Do App",
    type: "assignment",
    score: 90,
    maxScore: 100,
    status: "graded",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "g3",
    courseId: "c2",
    courseName: "Advanced TypeScript Masterclass",
    assessmentName: "Generics Quiz",
    type: "quiz",
    score: 60,
    maxScore: 100,
    status: "failed",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "g4",
    courseId: "c3",
    courseName: "UI/UX Design for Developers",
    assessmentName: "Redesign Landing Page",
    type: "assignment",
    score: null,
    maxScore: 100,
    status: "pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  }
];

export function GradesView() {
  const t = useTranslations("Grades");

  const getStatusBadge = (status: string, score: number | null) => {
    switch (status) {
      case "passed":
      case "graded":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-transparent font-medium">
            {status === "passed" ? t("status.passed") : t("status.graded")}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-transparent font-medium">
            {t("status.failed")}
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/5 font-medium">
            {t("status.pending")}
          </Badge>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === "quiz") return <HelpCircle className="h-4 w-4 text-indigo-500" />;
    return <FileText className="h-4 w-4 text-emerald-500" />;
  };

  // Calculate Overall Stats
  const totalGraded = MOCK_GRADES.filter(g => g.score !== null);
  const averageScore = totalGraded.length > 0 
    ? Math.round(totalGraded.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalGraded.length)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5 border-brand-border bg-white dark:bg-brand-card flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-brand-amber/10 flex items-center justify-center shrink-0">
            <Trophy className="h-6 w-6 text-brand-amber" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t("stats.average_score")}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{averageScore}%</h3>
          </div>
        </Card>
        
        <Card className="p-5 border-brand-border bg-white dark:bg-brand-card flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
            <HelpCircle className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t("stats.quizzes_taken")}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {MOCK_GRADES.filter(g => g.type === "quiz").length}
            </h3>
          </div>
        </Card>

        <Card className="p-5 border-brand-border bg-white dark:bg-brand-card flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t("stats.assignments")}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {MOCK_GRADES.filter(g => g.type === "assignment").length}
            </h3>
          </div>
        </Card>

        <Card className="p-5 border-brand-border bg-white dark:bg-brand-card flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t("stats.pending_review")}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {MOCK_GRADES.filter(g => g.status === "pending").length}
            </h3>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-brand-card p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder={t("search_placeholder")} 
            className="pl-9 border-brand-border bg-slate-50 dark:bg-slate-900/50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[140px] border-brand-border bg-slate-50 dark:bg-slate-900/50">
              <SelectValue placeholder={t("filter.course")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.all_courses")}</SelectItem>
              <SelectItem value="c1">React & Next.js 14</SelectItem>
              <SelectItem value="c2">Adv. TypeScript</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[140px] border-brand-border bg-slate-50 dark:bg-slate-900/50">
              <SelectValue placeholder={t("filter.type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.all_types")}</SelectItem>
              <SelectItem value="quiz">{t("filter.quizzes")}</SelectItem>
              <SelectItem value="assignment">{t("filter.assignments")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile/Tablet Card View (< 1024px) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {MOCK_GRADES.map(grade => (
          <Card key={grade.id} className="p-4 border-brand-border bg-white dark:bg-brand-card shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2 items-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md">
                  {getTypeIcon(grade.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{grade.assessmentName}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{grade.courseName}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mt-4 pt-4 border-t border-brand-border/50">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t("table.status")}</p>
                {getStatusBadge(grade.status, grade.score)}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{t("table.score")}</p>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {grade.score !== null ? `${grade.score} / ${grade.maxScore}` : "—"}
                </div>
              </div>
              <div className="col-span-2 mt-1">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(grade.submittedAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Table View (>= 1024px) */}
      <div className="hidden lg:block rounded-xl border border-brand-border bg-white dark:bg-brand-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow className="border-brand-border hover:bg-transparent">
              <TableHead className="w-[30%]">{t("table.assessment")}</TableHead>
              <TableHead className="w-[25%]">{t("table.course")}</TableHead>
              <TableHead>{t("table.type")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead className="text-right">{t("table.score")}</TableHead>
              <TableHead className="text-right w-[15%]">{t("table.date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_GRADES.map((grade) => (
              <TableRow key={grade.id} className="border-brand-border hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                <TableCell>
                  <div className="font-medium text-slate-900 dark:text-white">{grade.assessmentName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-slate-600 dark:text-slate-400 text-sm line-clamp-1">{grade.courseName}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 capitalize text-sm">
                    {getTypeIcon(grade.type)}
                    {t(`types.${grade.type}`)}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(grade.status, grade.score)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-semibold ${
                    grade.score && grade.score >= 80 ? 'text-emerald-600 dark:text-emerald-500' :
                    grade.score && grade.score < 80 ? 'text-rose-600 dark:text-rose-500' :
                    'text-slate-500'
                  }`}>
                    {grade.score !== null ? `${grade.score}/${grade.maxScore}` : "—"}
                  </span>
                </TableCell>
                <TableCell className="text-right text-slate-500 text-sm">
                  {format(new Date(grade.submittedAt), "MMM dd, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Stats overview forms a 1-col or 2-col grid. Toolbar stacks. Table is hidden, uses Card list layout instead for touch-friendly reading.
// tablet  (md):            Stats overview 2-col or 4-col. Toolbar side-by-side. Still uses Card list if < 1024px.
// desktop (lg / xl):       Full Table component for dense data presentation. Toolbar in single line.
// Interaction:             Hover effects on table rows. Select dropdowns for filtering.
