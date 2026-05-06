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
  Users
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";

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

const InstructorCoursesView = () => {
  const t = useTranslations("InstructorCourses");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for courses
  const courses = [
    { id: "1", title: "React for Beginners", status: "active", students: 450, revenue: 4500, lastUpdated: "2024-03-15" },
    { id: "2", title: "Advanced Next.js Architecture", status: "active", students: 120, revenue: 3600, lastUpdated: "2024-04-02" },
    { id: "3", title: "UI/UX Design Masterclass", status: "draft", students: 0, revenue: 0, lastUpdated: "2024-05-01" },
    { id: "4", title: "Node.js Backend Deep Dive", status: "active", students: 85, revenue: 2550, lastUpdated: "2024-02-20" },
    { id: "5", title: "Python for Data Science", status: "finished", students: 300, revenue: 6000, lastUpdated: "2023-12-10" },
  ];

  const filteredCourses = activeTab === "all"
    ? courses
    : courses.filter(c => c.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{t("status.active")}</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-slate-100 text-slate-500">{t("status.draft")}</Badge>;
      case "finished":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">{t("status.finished")}</Badge>;
      default:
        return null;
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
        <Button className="bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20 w-full md:w-auto gap-2 h-11">
          <Plus size={18} />
          {t("create_button")}
        </Button>
      </div>

      {/* Main Content Area */}
      <Card className="border-brand-border bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 h-11">
                <TabsTrigger value="all" className="px-4">{t("tabs.all")}</TabsTrigger>
                <TabsTrigger value="active" className="px-4">{t("tabs.active")}</TabsTrigger>
                <TabsTrigger value="draft" className="px-4">{t("tabs.draft")}</TabsTrigger>
                <TabsTrigger value="finished" className="px-4">{t("tabs.finished")}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder={t("search_placeholder")}
                  className="pl-10 bg-white dark:bg-slate-950 border-brand-border h-11"
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 border-brand-border">
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
                  <TableHead className="w-[40%] pl-6">{t("table.course")}</TableHead>
                  <TableHead className="text-center">{t("table.students")}</TableHead>
                  <TableHead className="text-center">{t("table.revenue")}</TableHead>
                  <TableHead className="text-center">{t("table.status")}</TableHead>
                  <TableHead className="text-right pr-6">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id} className="border-brand-border hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-20 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                            <BookOpen className="text-slate-400" size={20} />
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                              {course.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 italic">
                              {t("labels.last_updated")}: {course.lastUpdated}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{course.students}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t("labels.active")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">${course.revenue}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t("labels.total")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(course.status)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10" >
                            <Link href={`/instructor/courses/${course.id}/builder`}>
                              <Edit size={18} />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger >
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400">
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2 border-brand-border">
                              <DropdownMenuItem className="gap-2 cursor-pointer rounded-md">
                                <Eye size={16} /> {t("actions.preview")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer rounded-md">
                                <Users size={16} /> {t("actions.students")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer rounded-md text-red-500 focus:text-red-500 focus:bg-red-500/10">
                                <Trash2 size={16} /> {t("actions.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <BookOpen size={48} className="opacity-20 mb-2" />
                        <p>{t("empty")}</p>
                        <Button variant="link" className="text-brand-primary p-0 h-auto">
                          {t("create_button")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mini Stats for context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("stats.active_learners"), value: "2.4k", trend: "+12%", icon: Users, color: "text-blue-500" },
          { label: t("stats.completion"), value: "84%", trend: "+5%", icon: ArrowUpRight, color: "text-emerald-500" },
          { label: t("stats.revenue"), value: "$4.2k", trend: "+18%", icon: DollarSign, color: "text-purple-500" },
          { label: t("stats.rating"), value: "4.9/5", trend: "+0.1", icon: Eye, color: "text-amber-500" },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="border-brand-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                    <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InstructorCoursesView;

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Card-based layout (simulated in table with scroll), full-width search and buttons.
// tablet  (md / lg):       Table layout with condensed columns, 2-col mini stats.
// desktop (xl / 2xl):      Full table layout, 4-col mini stats, sticky headers.
// Interaction:             Touch targets >= 44px, hover states on table rows and action buttons.
