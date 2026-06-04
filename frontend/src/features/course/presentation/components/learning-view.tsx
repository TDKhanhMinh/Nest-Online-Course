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
  Upload,
  Loader2
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { DiscussionForum } from "./discussion-forum";
import { QuizPlayer } from "./quiz-player";
import { AssignmentSubmission } from "./assignment-submission";
import { useCourseDetail } from "../hooks/use-course-detail";

export function LearningView({ courseId }: { courseId: string }) {
  const t = useTranslations("Learning");
  const tc = useTranslations("Common");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Fetch real course details and curriculum
  const { data: course, isLoading, error } = useCourseDetail(courseId);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  // Load completed lessons list from localStorage (persisted per student & course)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`completed_lessons_${courseId}`);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      if (typeof window !== "undefined") {
        localStorage.setItem(`completed_lessons_${courseId}`, JSON.stringify(next));
      }
      return next;
    });
  };

  // Flattened list of lessons for progress calculation & prev/next index calculation
  const flattenedLessons = course?.sections?.flatMap((s) => s.lessons || []) || [];
  const totalLessons = flattenedLessons.length;
  const progress = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  // Set the first lesson of the first section as active once data loads
  useEffect(() => {
    if (course?.sections && course.sections.length > 0 && !currentLesson) {
      for (const section of course.sections) {
        if (section.lessons && section.lessons.length > 0) {
          setCurrentLesson(section.lessons[0]);
          break;
        }
      }
    }
  }, [course, currentLesson]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-brand-bg">
        <Loader2 className="h-10 w-10 animate-spin text-brand-amber" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center bg-brand-bg text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Course not found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">We couldn't retrieve the details for this course.</p>
        <Link href="/my-courses" className="mt-6">
          <Button className="bg-brand-amber text-black hover:bg-brand-amber/90">
            Back to My Courses
          </Button>
        </Link>
      </div>
    );
  }

  if (totalLessons === 0) {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col items-center justify-center bg-brand-bg text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No content in this course</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">The instructor has not added any lessons to this course yet.</p>
        <Link href="/my-courses" className="mt-6">
          <Button className="bg-brand-amber text-black hover:bg-brand-amber/90">
            Back to My Courses
          </Button>
        </Link>
      </div>
    );
  }

  const currentLessonIndex = currentLesson ? flattenedLessons.findIndex((l) => l.id === currentLesson.id) : -1;

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLesson(flattenedLessons[currentLessonIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex !== -1 && currentLessonIndex < totalLessons - 1) {
      setCurrentLesson(flattenedLessons[currentLessonIndex + 1]);
    }
  };

  const handleCompleteAndContinue = () => {
    if (currentLesson) {
      if (!completedLessonIds.includes(currentLesson.id)) {
        toggleLessonComplete(currentLesson.id);
      }
      handleNextLesson();
    }
  };

  const getLessonIcon = (type: string, isCurrent: boolean) => {
    switch (type.toLowerCase()) {
      case "quiz":
        return <HelpCircle className={`h-4 w-4 shrink-0 ${isCurrent ? "text-brand-amber" : "text-slate-400"}`} />;
      case "assignment":
        return <Upload className={`h-4 w-4 shrink-0 ${isCurrent ? "text-brand-amber" : "text-slate-400"}`} />;
      case "text":
        return <FileText className={`h-4 w-4 shrink-0 ${isCurrent ? "text-brand-amber" : "text-slate-400"}`} />;
      case "video":
      default:
        return <PlayCircle className={`h-4 w-4 shrink-0 ${isCurrent ? "text-brand-amber" : "text-slate-400"}`} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-brand-bg md:flex-row overflow-hidden">
      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden pb-16 md:pb-0">
        
        {currentLesson && currentLesson.type === "video" && (
          <>
            {/* Video Player */}
            <div className="relative aspect-video w-full shrink-0 bg-black flex items-center justify-center">
              {currentLesson.videoUrl || currentLesson.contentUrl ? (
                <video
                  key={currentLesson.id}
                  src={currentLesson.videoUrl || currentLesson.contentUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <PlayCircle className="mx-auto h-20 w-20 text-brand-amber opacity-40" />
                  <p className="mt-4 text-slate-400 font-sora">No video content for this lesson</p>
                </div>
              )}

              {/* Top Bar Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-4 z-10 pointer-events-none">
                <Link href="/my-courses" className="pointer-events-auto">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h2 className="font-sora text-sm font-semibold text-white md:text-base line-clamp-1">
                  {currentLesson.title}
                </h2>
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
                    {currentLesson.duration && (
                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {currentLesson.duration} Mins
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="hidden items-center gap-3 md:flex">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-brand-border"
                      onClick={handlePrevLesson}
                      disabled={currentLessonIndex <= 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t("navigation.prev")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-brand-border"
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex >= totalLessons - 1}
                    >
                      {t("navigation.next")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-brand-amber text-black hover:bg-brand-amber/90"
                      onClick={handleCompleteAndContinue}
                    >
                      {completedLessonIds.includes(currentLesson.id) ? "Completed & Next" : t("navigation.complete_continue")}
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
                    <div className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {currentLesson.content || currentLesson.textContent || "No description provided for this lesson."}
                    </div>
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

        {currentLesson && currentLesson.type === "text" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="container max-w-4xl px-4 py-8">
              {/* Header with back link */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/my-courses">
                    <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-amber">Text Lesson</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-brand-border"
                    onClick={handlePrevLesson}
                    disabled={currentLessonIndex <= 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("navigation.prev")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-brand-border"
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex >= totalLessons - 1}
                  >
                    {t("navigation.next")}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-brand-amber text-black hover:bg-brand-amber/90"
                    onClick={handleCompleteAndContinue}
                  >
                    {completedLessonIds.includes(currentLesson.id) ? "Completed & Next" : t("navigation.complete_continue")}
                  </Button>
                </div>
              </div>
              
              <div className="mb-8 border-b border-brand-border pb-6">
                <h1 className="font-sora text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                  {currentLesson.title}
                </h1>
                {currentLesson.duration && (
                  <div className="mt-2 text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{currentLesson.duration} Mins Read</span>
                  </div>
                )}
              </div>

              {/* Text content container */}
              <div className="prose dark:prose-invert max-w-none text-slate-750 dark:text-slate-300 leading-relaxed whitespace-pre-wrap my-8">
                {currentLesson.content || currentLesson.textContent || (
                  <p className="italic text-slate-500">No content available for this lesson.</p>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-brand-border">
                <DiscussionForum />
              </div>
            </div>
          </div>
        )}

        {currentLesson && currentLesson.type === "quiz" && (
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
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex <= 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("navigation.prev")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex >= totalLessons - 1}
                >
                  {t("navigation.next")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-[73px] flex-1">
              <QuizPlayer />
            </div>
          </div>
        )}

        {currentLesson && currentLesson.type === "assignment" && (
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
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex <= 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t("navigation.prev")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex >= totalLessons - 1}
                >
                  {t("navigation.next")}
                  <ChevronRight className="h-4 w-4" />
                </Button>
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
          <Button 
            className="flex-[2] bg-brand-amber text-black hover:bg-brand-amber/90 text-xs font-bold"
            onClick={handleCompleteAndContinue}
            disabled={currentLessonIndex >= totalLessons - 1 && completedLessonIds.includes(currentLesson?.id)}
          >
            {currentLessonIndex >= totalLessons - 1 ? "Finish" : "Next"}
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
            className="fixed inset-y-0 right-0 z-[60] w-full bg-white dark:bg-brand-card shadow-2xl md:relative md:z-auto md:w-80 lg:w-96 md:border-l md:border-brand-border animate-fade-in-up"
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
                <Accordion 
                  multiple 
                  defaultValue={course.sections?.map((section: any) => section.id) || []} 
                  className="px-2 pb-20"
                >
                  {course.sections?.map((section: any, sIdx: number) => (
                    <AccordionItem key={section.id} value={section.id} className="border-none">
                      <AccordionTrigger className="hover:no-underline py-4 px-3 text-left">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-brand-amber uppercase tracking-wider">SECTION {sIdx + 1}</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{section.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <div className="space-y-1">
                          {section.lessons?.map((lesson: any) => {
                            const isCurrent = currentLesson?.id === lesson.id;
                            const isCompleted = completedLessonIds.includes(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => {
                                  setCurrentLesson(lesson);
                                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                                }}
                                className={`group flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors ${isCurrent
                                  ? "bg-brand-amber/10 border-l-4 border-brand-amber"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }`}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLessonComplete(lesson.id);
                                  }}
                                  className="focus:outline-none mt-0.5 shrink-0"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  ) : (
                                    getLessonIcon(lesson.type, isCurrent)
                                  )}
                                </button>
                                <div className="flex-1 overflow-hidden">
                                  <p className={`text-sm leading-snug ${isCurrent ? "font-bold text-brand-amber" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                                    {lesson.title}
                                  </p>
                                  {lesson.duration && (
                                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                                      <Clock className="h-3 w-3" />
                                      <span>{lesson.duration} mins</span>
                                    </div>
                                  )}
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
