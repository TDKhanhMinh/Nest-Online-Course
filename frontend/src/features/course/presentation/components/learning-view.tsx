"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  Menu,
  MessageSquare,
  PlayCircle,
  X,
  HelpCircle,
  Upload
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DiscussionForum } from "./discussion-forum";
import { QuizPlayer } from "./quiz-player";
import { AssignmentSubmission } from "./assignment-submission";

type LessonType = "video" | "quiz" | "assignment";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: LessonType;
}

const MOCK_COURSE = {
  id: "react-1",
  title: "React & Next.js 14 — Complete from Zero to Hero",
  sections: [
    {
      id: "s1",
      title: "Introduction to React",
      lessons: [
        { id: "l1", title: "Course Overview", duration: "05:20", completed: true, type: "video" as LessonType },
        { id: "l2", title: "Setting up Environment", duration: "12:45", completed: true, type: "video" as LessonType },
      ]
    },
    {
      id: "s2",
      title: "React Fundamentals",
      lessons: [
        { id: "l3", title: "JSX & Components", duration: "18:30", completed: true, type: "video" as LessonType },
        { id: "l4", title: "React Core Concepts Quiz", duration: "15:00", completed: false, type: "quiz" as LessonType },
        { id: "l5", title: "Build a To-Do App", duration: "3 Days", completed: false, type: "assignment" as LessonType },
      ]
    },
    {
      id: "s3",
      title: "Next.js App Router",
      lessons: [
        { id: "l6", title: "File-based Routing", duration: "22:10", completed: false, type: "video" as LessonType },
        { id: "l7", title: "Server Components vs Client Components", duration: "35:00", completed: false, type: "video" as LessonType },
      ]
    }
  ]
};

export function LearningView() {
  const t = useTranslations("Learning");
  const tc = useTranslations("Common");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(MOCK_COURSE.sections[1].lessons[0]); // JSX & Components
  const [progress, setProgress] = useState(35);

  const getLessonIcon = (type: LessonType, isCurrent: boolean) => {
    switch (type) {
      case "quiz":
        return <HelpCircle className={`h-4 w-4 shrink-0 ${isCurrent ? "text-brand-amber" : "text-slate-400"}`} />;
      case "assignment":
        return <Upload className={`h-4 w-4 shrink-0 ${isCurrent ? "text-brand-amber" : "text-slate-400"}`} />;
      case "video":
      default:
        return <PlayCircle className={`h-4 w-4 shrink-0 ${isCurrent ? "text-brand-amber" : "text-slate-400"}`} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-brand-bg md:flex-row overflow-hidden">
      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        
        {currentLesson.type === "video" && (
          <>
            {/* Video Player (Placeholder) */}
            <div className="relative aspect-video w-full shrink-0 bg-black flex items-center justify-center group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="mx-auto h-20 w-20 text-brand-amber opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  <p className="mt-4 text-slate-400 font-sora">Click to play lesson video</p>
                </div>
              </div>

              {/* Top Bar Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-4 z-10">
                <Link href="/my-courses">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h2 className="font-sora text-sm font-semibold text-white md:text-base line-clamp-1">
                  {currentLesson.title}
                </h2>
              </div>

              {/* Player Controls (Mock) */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-10">
                <div className="h-full bg-brand-amber w-1/3 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              </div>
            </div>

            {/* Content Tabs & Info */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="container max-w-4xl px-4 py-8">
                <div className="mb-8 flex items-center justify-between border-b border-brand-border pb-6">
                  <div>
                    <h1 className="font-sora text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                      {currentLesson.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {currentLesson.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        Resources (2)
                      </span>
                    </div>
                  </div>
                  <div className="hidden items-center gap-3 md:flex">
                    <Button variant="outline" size="sm" className="gap-2 border-brand-border">
                      <ChevronLeft className="h-4 w-4" />
                      {t("navigation.prev")}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 border-brand-border">
                      {t("navigation.next")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-brand-amber text-black hover:bg-brand-amber/90">
                      {t("navigation.complete_continue")}
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-transparent border-b border-brand-border w-full justify-start rounded-none h-auto p-0 gap-8">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-amber data-[state=active]:bg-transparent px-0 py-3 text-sm font-semibold"
                    >
                      {t("tabs.overview")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="notes"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-amber data-[state=active]:bg-transparent px-0 py-3 text-sm font-semibold"
                    >
                      {t("tabs.notes")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="qa"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-amber data-[state=active]:bg-transparent px-0 py-3 text-sm font-semibold"
                    >
                      {t("tabs.qa")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="pt-6 prose dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-400">
                      In this lesson, we will dive deep into React Props and State. These are the building blocks of interactive components.
                    </p>
                    <h4 className="font-sora text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4">Key Learning Objectives</h4>
                    <ul className="space-y-2 list-none p-0">
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                        Understand unidirectional data flow.
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                        Differentiate between functional components and class components (legacy).
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-amber" />
                        Master the useState hook for state management.
                      </li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="notes" className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-bg border border-brand-border text-slate-400">
                        <FileText className="h-8 w-8" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">No notes for this lesson</h4>
                      <p className="mt-2 text-sm text-slate-500 max-w-xs">
                        Start taking notes to remember important concepts and time-stamped moments.
                      </p>
                      <Button className="mt-6 border-brand-amber text-brand-amber" variant="outline">
                        Add new note
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="qa" className="pt-6">
                    <DiscussionForum />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}

        {currentLesson.type === "quiz" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between gap-4 z-10 border-b border-brand-border bg-white dark:bg-brand-bg">
              <div className="flex items-center gap-4">
                <Link href="/my-courses">
                  <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h2 className="font-sora text-sm font-semibold text-slate-900 dark:text-white md:text-base line-clamp-1">
                  Quiz: {currentLesson.title}
                </h2>
              </div>
            </div>
            <div className="mt-[73px] flex-1">
              <QuizPlayer />
            </div>
          </div>
        )}

        {currentLesson.type === "assignment" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between gap-4 z-10 border-b border-brand-border bg-white dark:bg-brand-bg">
              <div className="flex items-center gap-4">
                <Link href="/my-courses">
                  <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h2 className="font-sora text-sm font-semibold text-slate-900 dark:text-white md:text-base line-clamp-1">
                  Assignment: {currentLesson.title}
                </h2>
              </div>
            </div>
            <div className="mt-[73px] flex-1">
              <AssignmentSubmission />
            </div>
          </div>
        )}

        {/* Floating Mobile Nav */}
        <div className="fixed bottom-0 left-0 right-0 flex border-t border-brand-border bg-white p-2 dark:bg-brand-bg md:hidden z-50">
          <Button variant="ghost" className="flex-1 gap-2 text-xs" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
            Content
          </Button>
          <div className="h-8 w-px bg-brand-border mx-2" />
          <Button className="flex-[2] bg-brand-amber text-black hover:bg-brand-amber/90 text-xs font-bold">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sidebar - Curriculum */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: 350 }}
            animate={{ x: 0 }}
            exit={{ x: 350 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[60] w-full bg-white dark:bg-brand-card shadow-2xl md:relative md:z-auto md:w-80 lg:w-96 md:border-l md:border-brand-border"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-brand-border p-5">
                <h3 className="font-sora font-bold text-slate-900 dark:text-white">{t("sidebar.title")}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-5 border-b border-brand-border">
                <div className="mb-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">YOUR PROGRESS</span>
                  <span className="text-brand-amber">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              <ScrollArea className="flex-1">
                <Accordion defaultValue={["s2"]} className="px-2 pb-20">
                  {MOCK_COURSE.sections.map((section, sIdx) => (
                    <AccordionItem key={section.id} value={section.id} className="border-none">
                      <AccordionTrigger className="hover:no-underline py-4 px-3 text-left">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-brand-amber uppercase tracking-wider">SECTION {sIdx + 1}</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{section.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="space-y-1">
                          {section.lessons.map((lesson) => {
                            const isCurrent = currentLesson.id === lesson.id;
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => {
                                  setCurrentLesson(lesson as Lesson);
                                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                                }}
                                className={`group flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors ${isCurrent
                                  ? "bg-brand-amber/10 border-l-4 border-brand-amber"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }`}
                              >
                                {lesson.completed ? (
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                ) : (
                                  getLessonIcon(lesson.type as LessonType, isCurrent)
                                )}
                                <div className="flex-1 overflow-hidden">
                                  <p className={`text-sm leading-snug ${isCurrent ? "font-bold text-brand-amber" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                                    {lesson.title}
                                  </p>
                                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Toggle Button (Desktop) */}
      {!isSidebarOpen && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed right-0 top-1/2 z-40 hidden h-10 w-8 -translate-y-1/2 rounded-r-none border border-r-0 border-brand-border bg-white dark:bg-brand-card md:flex shadow-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

// --- Hybrid Responsive Summary ---
// mobile  (default / sm):  Video takes top portion, content below. Sidebar becomes a full-screen drawer. Bottom sticky nav added.
// tablet  (md / lg):       Sidebar is relative, content fits side-by-side. Tabs for course details.
// desktop (xl / 2xl):      Max-width containers for content, rich scrolling areas, animated sidebar toggles.
// Interaction:             Sidebar collapsible, lesson selection updates video area or mounts Quizzes/Assignments, progress bar reflects state.
