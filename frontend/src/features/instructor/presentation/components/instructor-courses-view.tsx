"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  DollarSign,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseStatus } from "@/features/course/domain/course.types";
import { CreateCourseDialog } from "@/features/course/presentation/components/create-course-dialog";
import {
  useDeleteCourse,
  usePublishCourse,
} from "@/features/course/presentation/hooks/use-course-mutations";
import { useInstructorCourses } from "@/features/course/presentation/hooks/use-instructor-courses";
import { useDebounce } from "@/hooks/use-debounce";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/format-currentcy";
import { formatDateTime } from "@/lib/format-datetime";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface InstructorCourseListItem {
  _id?: {
    value?: string;
  };
  id?: string;
  props?: {
    status?: CourseStatus | string;
    thumbnailUrl?: string;
    title?: {
      value?: string;
    };
    updatedAt?: string;
    level?: string;
    totalEnrolled?: number;
    price?: number;
  };
}

interface InstructorCourseListResponse {
  data?: InstructorCourseListItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const InstructorCoursesView = () => {
  const t = useTranslations("InstructorCourses");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const status =
    activeTab === "all"
      ? undefined
      : activeTab === "active"
        ? CourseStatus.PUBLISHED
        : activeTab === "draft"
          ? CourseStatus.DRAFT
          : undefined;

  const {
    data: res,
    isLoading,
    isError,
  } = useInstructorCourses({
    page,
    limit,
    search: debouncedSearch,
    status,
  });
  const { mutateAsync: deleteCourse, isPending: isDeleting } =
    useDeleteCourse();
  const { mutateAsync: publishCourse, isPending: isPublishing } =
    usePublishCourse({
      successMessage: t("messages.submit_review_success"),
    });
  const [courseToDeleteId, setCourseToDeleteId] = useState<string | null>(null);
  const [publishingCourseId, setPublishingCourseId] = useState<string | null>(
    null,
  );

  const coursesResponse = res?.courses as unknown as
    | InstructorCourseListResponse
    | undefined;
  const courses = coursesResponse?.data || [];
  const meta = coursesResponse?.pagination;
  console.log("courses", courses);

  // No longer need client-side filtering as it's handled by the backend
  const filteredCourses = courses;

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PUBLISHED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            {t("status.active")}
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-500">
            {t("status.draft")}
          </Badge>
        );
      case "PENDING_APPROVAL":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            {t("status.pending_approval")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDelete = (id: string) => {
    setCourseToDeleteId(id);
  };

  const handleSubmitForReview = async (id: string) => {
    setPublishingCourseId(id);
    try {
      await publishCourse(id);
    } finally {
      setPublishingCourseId(null);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t("description")}
          </p>
        </div>
        <CreateCourseDialog
          trigger={
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-black shadow-lg shadow-brand-primary/20 w-full md:w-auto gap-2 h-11">
              <Plus size={18} />
              {t("create_button")}
            </Button>
          }
        />
      </div>

      {/* Main Content Area */}
      <Card className="border-brand-border bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <Tabs
              defaultValue="all"
              className="w-full sm:w-auto"
              onValueChange={(value) => {
                setActiveTab(value);
                setPage(1);
              }}
            >
              <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 h-11">
                <TabsTrigger value="all" className="px-4">
                  {t("tabs.all")}
                </TabsTrigger>
                <TabsTrigger value="active" className="px-4">
                  {t("tabs.active")}
                </TabsTrigger>
                <TabsTrigger value="draft" className="px-4">
                  {t("tabs.draft")}
                </TabsTrigger>
                <TabsTrigger value="finished" className="px-4">
                  {t("tabs.finished")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  placeholder={t("search_placeholder")}
                  className="pl-10 bg-white dark:bg-slate-950 border-brand-border h-11"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 border-brand-border"
              >
                <Filter size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow className="border-brand-border hover:bg-transparent">
                  <TableHead className="pl-2">{t("table.course")}</TableHead>
                  <TableHead className="text-center">
                    {t("table.level")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("table.students")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("table.price")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("table.status")}
                  </TableHead>
                  <TableHead className="text-right pr-6">
                    {t("table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6 py-4">
                        <Skeleton className="h-12 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-12 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-12 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-20 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-12 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-64 text-center text-red-500"
                    >
                      Error loading courses. Please try again later.
                    </TableCell>
                  </TableRow>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const courseId = course?._id?.value || course?.id || "";
                    const courseTitle = course?.props?.title?.value || "";
                    const courseStatus = course?.props?.status || "";
                    const updatedAt = course?.props?.updatedAt || "";
                    const coursePrice = course?.props?.price ?? 0;
                    const canSubmitForReview =
                      courseStatus === CourseStatus.DRAFT;
                    const isSubmittingThisCourse =
                      isPublishing && publishingCourseId === courseId;

                    return (
                      <TableRow
                        key={courseId}
                        className="border-brand-border hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <TableCell className="pl-2 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-20 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                              {course?.props?.thumbnailUrl ? (
                                <Image
                                  src={course?.props?.thumbnailUrl}
                                  alt={courseTitle}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              ) : (
                                <BookOpen className="text-slate-400" size={20} />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                                {courseTitle}
                              </p>
                              <p className="text-xs text-slate-400 mt-1 italic">
                                {t("labels.last_updated")}:{" "}
                                {formatDateTime(
                                  updatedAt,
                                  "vi-VN",
                                )}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {course?.props?.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {course?.props?.totalEnrolled}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {formatCurrency(coursePrice)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(courseStatus)}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10"
                            >
                              <Link
                                href={`/instructor/courses/${courseId}/builder`}
                              >
                                <Edit size={18} />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-slate-400"
                                  >
                                    <MoreVertical size={18} />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent
                                align="end"
                                className="w-48 p-2 border-brand-border"
                              >
                                {canSubmitForReview && (
                                  <DropdownMenuItem
                                    className="gap-2 cursor-pointer rounded-md"
                                    disabled={isSubmittingThisCourse}
                                    onClick={() => handleSubmitForReview(courseId)}
                                  >
                                    <Eye size={16} />{" "}
                                    {isSubmittingThisCourse
                                      ? t("actions.submitting_review")
                                      : t("actions.submit_review")}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="gap-2 cursor-pointer rounded-md">
                                  <Users size={16} /> {t("actions.students")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2 cursor-pointer rounded-md text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                  onClick={() =>
                                    handleDelete(courseId)
                                  }
                                >
                                  <Trash2 size={16} /> {t("actions.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <BookOpen size={48} className="opacity-20 mb-2" />
                        <p>{t("empty")}</p>
                        <CreateCourseDialog
                          trigger={
                            <Button
                              variant="link"
                              className="text-brand-primary p-0 h-auto"
                            >
                              {t("create_button")}
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-brand-border bg-slate-50/50 dark:bg-slate-800/30">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t("pagination.showing", {
                  start: (meta.page - 1) * meta.limit + 1,
                  end: Math.min(meta.page * meta.limit, meta.total),
                  total: meta.total,
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="h-9 px-3 border-brand-border"
                >
                  {t("pagination.previous")}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={meta.page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className={`h-9 w-9 p-0 border-brand-border ${meta.page === p
                            ? "bg-brand-primary text-white"
                            : "hover:bg-brand-primary/10 hover:text-brand-primary"
                          }`}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="h-9 px-3 border-brand-border"
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mini Stats for context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: t("stats.active_learners"),
            value: "2.4k",
            trend: "+12%",
            icon: Users,
            color: "text-blue-500",
          },
          {
            label: t("stats.completion"),
            value: "84%",
            trend: "+5%",
            icon: ArrowUpRight,
            color: "text-emerald-500",
          },
          {
            label: t("stats.revenue"),
            value: "$4.2k",
            trend: "+18%",
            icon: DollarSign,
            color: "text-purple-500",
          },
          {
            label: t("stats.rating"),
            value: "4.9/5",
            trend: "+0.1",
            icon: Eye,
            color: "text-amber-500",
          },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="border-brand-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className={`text-[10px] font-bold ${stat.color}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}
                >
                  <stat.icon size={20} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        open={courseToDeleteId !== null}
        onOpenChange={(open) => !open && setCourseToDeleteId(null)}
        title={t("delete_title")}
        description={t("delete_description")}
        confirmText={isDeleting ? t("deleting") : t("actions.delete")}
        cancelText={t("cancel")}
        confirmVariant="destructive"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (courseToDeleteId) {
            try {
              await deleteCourse(courseToDeleteId);
            } catch (error) {
              console.error("Delete course failed:", error);
            } finally {
              setCourseToDeleteId(null);
            }
          }
        }}
      />
    </motion.div>
  );
};

export default InstructorCoursesView;
