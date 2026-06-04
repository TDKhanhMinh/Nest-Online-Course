"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAdminCourseDetail } from "../hooks/use-admin-courses";
import { useAllCategories } from "@/features/category/presentation/hooks/use-categories";
import { CourseLevel, CourseStatus } from "@/features/course/domain/course.types";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  Coins,
  FileText,
  Globe,
  GraduationCap,
  HelpCircle,
  Layers,
  PlayCircle,
  User,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseDetailDialogProps {
  courseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailDialog({
  courseId,
  open,
  onOpenChange,
}: CourseDetailDialogProps) {
  const { data: course, isLoading, error } = useAdminCourseDetail(
    courseId || "",
    open
  );

  const { data: categories } = useAllCategories();

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c.id === categoryId)?.name || "Chưa phân loại";
  };

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.PUBLISHED:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
            Đã xuất bản
          </Badge>
        );
      case CourseStatus.DRAFT:
        return (
          <Badge variant="secondary" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            Bản nháp
          </Badge>
        );
      case CourseStatus.PENDING_APPROVAL:
        return (
          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
            Chờ duyệt
          </Badge>
        );
      case CourseStatus.REJECTED:
        return (
          <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLevelLabel = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return "Cơ bản (Beginner)";
      case CourseLevel.INTERMEDIATE:
        return "Trung cấp (Intermediate)";
      case CourseLevel.ADVANCED:
        return "Nâng cao (Advanced)";
      default:
        return level;
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };



  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-emerald-500" />;
      case "text":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      case "assignment":
        return <GraduationCap className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLessonTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Bài học video";
      case "text":
        return "Tài liệu văn bản";
      case "quiz":
        return "Trắc nghiệm";
      case "assignment":
        return "Bài tập";
      default:
        return type;
    }
  };

  const totalLessonsCount =
    course?.sections.reduce((acc, section) => acc + section.lessons.length, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-[90dvh] sm:h-auto sm:max-w-3xl md:max-w-4xl p-0 overflow-hidden bg-background/95 border border-border/50 rounded-t-2xl sm:rounded-2xl shadow-2xl transition-all duration-300">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 flex flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground line-clamp-1">
                Chi tiết khóa học
              </DialogTitle>
              {course && getStatusBadge(course.status)}
            </div>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              Xem toàn bộ thông tin chi tiết và giáo trình học của khóa học.
            </DialogDescription>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90dvh-120px)] sm:max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ) : error || !course ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <X className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Không tìm thấy thông tin</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Đã xảy ra lỗi khi truy xuất dữ liệu chi tiết của khóa học hoặc khóa học không tồn tại.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden flex flex-col flex-1">
            <Tabs defaultValue="overview" className="flex flex-col flex-1">
              <div className="px-6 border-b border-border/50 bg-muted/20">
                <TabsList className="bg-transparent h-12 w-full justify-start gap-6 rounded-none p-0 border-b border-transparent">
                  <TabsTrigger
                    value="overview"
                    className="relative rounded-none border-b-2 border-transparent px-1 pb-3 pt-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all"
                  >
                    Tổng quan khóa học
                  </TabsTrigger>
                  <TabsTrigger
                    value="curriculum"
                    className="relative rounded-none border-b-2 border-transparent px-1 pb-3 pt-3 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent transition-all"
                  >
                    Chương trình học ({course.sections.length} phần, {totalLessonsCount} bài)
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90dvh-180px)] sm:max-h-[65vh] flex-1">
                <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Panel: Thumbnail & Description */}
                    <div className="lg:col-span-2 space-y-6">
                      {course.thumbnailUrl ? (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/50 bg-muted group shadow-md">
                          <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center gap-2 text-muted-foreground shadow-inner">
                          <BookOpen className="h-12 w-12 text-primary/40" />
                          <span className="text-xs">Chưa có ảnh bìa khóa học</span>
                        </div>
                      )}

                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Tiêu đề khóa học</h3>
                        <p className="text-base font-semibold text-foreground leading-relaxed">
                          {course.title}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Mô tả khóa học</h3>
                        <div className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/30 whitespace-pre-wrap max-h-[250px] overflow-y-auto">
                          {course.description || "Không có mô tả cho khóa học này."}
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Summary Box */}
                    <div className="bg-card rounded-xl border border-border/50 p-5 space-y-5 shadow-sm">
                      <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                        Thông tin chi tiết
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Coins className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">Giá bán</p>
                            <p className="text-base font-bold text-foreground">
                              {formatPrice(course.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">Giảng viên (ID)</p>
                            <p className="text-sm font-medium text-foreground break-all">
                              {course.instructorId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">Danh mục</p>
                            <p className="text-sm font-medium text-foreground">
                              {getCategoryName(course.categoryId)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">Trình độ</p>
                            <p className="text-sm font-medium text-foreground">
                              {getLevelLabel(course.level)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground">Ngôn ngữ</p>
                            <p className="text-sm font-medium text-foreground">
                              {course.language || "Tiếng Việt"}
                            </p>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="m-0 focus-visible:outline-none">
                  {course.sections.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <BookOpen className="h-10 w-10 opacity-30" />
                      <p className="text-sm">Khóa học này chưa được phân bổ chương trình học.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {course.sections.map((section, sIndex) => (
                        <div
                          key={section.id || sIndex}
                          className="border border-border/50 rounded-xl overflow-hidden bg-card/30 shadow-sm"
                        >
                          <div className="bg-muted/30 px-5 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                                <span className="text-primary text-xs uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md font-semibold">
                                  Phần {section.orderIndex}
                                </span>
                                {section.title}
                              </h4>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 font-medium bg-background/50 border border-border/30 px-2.5 py-1 rounded-full">
                              {section.lessons.length} bài học
                            </span>
                          </div>

                          {section.lessons.length === 0 ? (
                            <div className="p-4 text-center text-xs text-muted-foreground bg-background/10">
                              Chưa có bài học nào trong phần này.
                            </div>
                          ) : (
                            <div className="divide-y divide-border/30">
                              {section.lessons.map((lesson, lIndex) => (
                                <div
                                  key={lesson.id || lIndex}
                                  className="p-4 flex items-start sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
                                >
                                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                                    <div className="mt-0.5 sm:mt-0 shrink-0">
                                      {getLessonIcon(lesson.type)}
                                    </div>
                                    <div className="min-w-0 space-y-0.5">
                                      <p className="text-sm font-medium text-foreground leading-tight line-clamp-1">
                                        {lesson.orderIndex}. {lesson.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {getLessonTypeLabel(lesson.type)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    {lesson.isFreePreview && (
                                      <Badge
                                        variant="outline"
                                        className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[10px] py-0 px-1.5"
                                      >
                                        Học thử
                                      </Badge>
                                    )}
                                    {lesson.duration && (
                                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.duration}m
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Bottom-sheet style (rounded-t-2xl, height 90dvh), title wraps, stacked overview layout (single column), scrollable tabs content, touch targeted inputs/icons.
// tablet  (md / lg):       Centered dialog (max-w-3xl / 4xl, max-h 70vh), 2 columns in overview: left for course details (thumbnail, description), right sidebar detail box, custom headers and dividers.
// desktop (xl / 2xl):      Full width centered dialog (max-w-4xl), hover states for curriculum items and image scale effect, high information density, smooth glassmorphism design.
// Interaction:             Scrollable containers, click triggers, clear visual feedback for tabs, and touch safe target margins.
