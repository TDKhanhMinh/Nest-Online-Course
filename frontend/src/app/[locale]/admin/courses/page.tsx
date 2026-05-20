import { Metadata } from "next";
import { CourseTable } from "@/features/admin/presentation/components/course-table";
import { BookOpen, Plus, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Quản lý khóa học | NexLearn Admin",
  description: "Hệ thống quản lý và phê duyệt khóa học chuyên nghiệp",
};

export default function AdminCoursesPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Quản lý khóa học
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Giám sát, phê duyệt và quản lý nội dung tất cả các khóa học trên hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Tạo khóa học mới
          </Button>
        </div>
      </div>

      {/* Stats Overview - Optional but adds premium feel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng khóa học", value: "1,284", change: "+12%", color: "primary" },
          { label: "Đang chờ duyệt", value: "45", change: "-5%", color: "amber" },
          { label: "Đã xuất bản", value: "1,120", change: "+8%", color: "emerald" },
          { label: "Khóa học bị báo cáo", value: "12", change: "+2", color: "destructive" },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="p-5 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md transition-all hover:border-primary/20 group cursor-default"
          >
            <p className="text-sm font-medium text-muted-foreground mb-2 group-hover:text-foreground/80 transition-colors">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.change.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="flex flex-col gap-4">
        <CourseTable />
      </div>
    </div>
  );
}
