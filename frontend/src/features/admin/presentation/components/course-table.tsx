"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllCategories } from "@/features/category/presentation/hooks/use-categories";
import { CourseStatus } from "@/features/course/domain/course.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CheckCircle,
  Eye,
  Filter,
  Layers,
  MoreHorizontal,
  Search,
  Trash2,
  XCircle
} from "lucide-react";
import { useState } from "react";
import type { AdminCourseStatus } from "../../infrastructure/admin-course.api";
import { useAdminCourseMutations, useAdminCourses } from "../hooks/use-admin-courses";
import { CourseDetailDialog } from "./course-detail-dialog";

type AdminCourseFilterStatus = AdminCourseStatus | "ALL";

export function CourseTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AdminCourseFilterStatus>("ALL");
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const limit = 10;

  const { data, isLoading } = useAdminCourses({
    page,
    limit,
    status: status === "ALL" ? undefined : status,
    search: search || undefined,
  });

  const { data: categories } = useAllCategories();

  const { updateStatus, updateCategory, deleteCourse } = useAdminCourseMutations();

  const handleStatusChange = (id: string, newStatus: AdminCourseStatus) => {
    updateStatus.mutate({ id, status: newStatus });
  };

  const handleCategoryChange = (id: string, categoryId: string) => {
    updateCategory.mutate({ id, categoryId });
  };

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.PUBLISHED:
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Đã xuất bản</Badge>;
      case CourseStatus.DRAFT:
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-500 border-slate-500/20">Bản nháp</Badge>;
      case CourseStatus.PENDING_APPROVAL:
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">Chờ duyệt</Badge>;
      case CourseStatus.REJECTED:
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories?.find(c => c.id === categoryId)?.name || "Chưa phân loại";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="rounded-md border border-border/50">
          <div className="h-[400px] w-full flex flex-col gap-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={status as string}
            onValueChange={(value) => setStatus(value as AdminCourseFilterStatus)}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-border/50">
              <Filter className="h-4 w-4 mr-2 opacity-50" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value={CourseStatus.DRAFT}>Bản nháp</SelectItem>
              <SelectItem value={CourseStatus.PENDING_APPROVAL}>Chờ duyệt</SelectItem>
              <SelectItem value={CourseStatus.PUBLISHED}>Đã xuất bản</SelectItem>
              <SelectItem value={CourseStatus.REJECTED}>Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[300px] font-semibold text-foreground">Khóa học</TableHead>
                <TableHead className="font-semibold text-foreground">Giảng viên</TableHead>
                <TableHead className="font-semibold text-foreground">Danh mục</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Trạng thái</TableHead>
                <TableHead className="font-semibold text-foreground text-right">Giá</TableHead>
                <TableHead className="font-semibold text-foreground">Ngày tạo</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy khóa học nào
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((course) => (
                  <TableRow key={course.id} className="hover:bg-muted/30 border-border/50 transition-colors group">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="line-clamp-1 group-hover:text-primary transition-colors">{course.title}</span>
                        <span className="text-xs text-muted-foreground font-normal">ID: {course.id.slice(-8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                          {course.instructorId.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm truncate max-w-[120px]">{course.instructorId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal border-border/50 bg-background/50">
                        {getCategoryName(course.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(course.status)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {course.price === 0 ? (
                        <span className="text-emerald-500">Miễn phí</span>
                      ) : (
                        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(course.price)
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {format(new Date(course.createdAt), "dd/MM/yyyy", { locale: vi })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-56 p-1 bg-background/95 backdrop-blur-md border-border/50">
                          <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 font-normal uppercase tracking-wider">Hành động</DropdownMenuLabel>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary"
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" /> Xem chi tiết
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-border/50" />
                          <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 font-normal uppercase tracking-wider">Quản lý</DropdownMenuLabel>

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="gap-2">
                              <Layers className="h-4 w-4" /> Thay đổi danh mục
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                                {categories?.map((cat) => (
                                  <DropdownMenuItem
                                    key={cat.id}
                                    className={cn(
                                      "cursor-pointer",
                                      course.categoryId === cat.id && "bg-primary/10 text-primary font-medium"
                                    )}
                                    onClick={() => handleCategoryChange(course.id, cat.id)}
                                  >
                                    {cat.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator className="bg-border/50" />
                          <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 font-normal uppercase tracking-wider">Trạng thái</DropdownMenuLabel>

                          {course.status !== CourseStatus.PUBLISHED && (
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-emerald-500 focus:text-emerald-600 focus:bg-emerald-500/10"
                              onClick={() => handleStatusChange(course.id, CourseStatus.PUBLISHED)}
                            >
                              <CheckCircle className="h-4 w-4" /> Duyệt & Xuất bản
                            </DropdownMenuItem>
                          )}

                          {course.status !== CourseStatus.REJECTED && course.status === CourseStatus.PENDING_APPROVAL && (
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-500/10"
                              onClick={() => handleStatusChange(course.id, CourseStatus.REJECTED)}
                            >
                              <XCircle className="h-4 w-4" /> Từ chối phê duyệt
                            </DropdownMenuItem>
                          )}

                          {course.status !== CourseStatus.DRAFT && (
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer text-amber-500 focus:text-amber-600 focus:bg-amber-500/10"
                              onClick={() => handleStatusChange(course.id, CourseStatus.DRAFT)}
                            >
                              <XCircle className="h-4 w-4" /> Gỡ xuống (Draft)
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator className="bg-border/50" />
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-medium"
                            onClick={() => deleteCourse.mutate(course.id)}
                          >
                            <Trash2 className="h-4 w-4" /> Xóa vĩnh viễn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.pagination.pageCount > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="font-medium text-foreground">{data.data.length}</span> / <span className="font-medium text-foreground">{data.pagination.itemCount}</span> khóa học
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!data.pagination.hasPreviousPage}
                  className="gap-1 border-border/50 bg-background/50"
                >
                  <PaginationPrevious className="hover:bg-transparent" />
                </Button>
              </PaginationItem>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: data.pagination.pageCount }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        "cursor-pointer",
                        page === i + 1 ? "bg-primary text-primary-foreground border-primary" : "border-border/50 bg-background/50"
                      )}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </div>

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.pagination.hasNextPage}
                  className="gap-1 border-border/50 bg-background/50"
                >
                  <PaginationNext className="hover:bg-transparent" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <CourseDetailDialog
        courseId={selectedCourseId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
