"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import {
  ChevronLeft,
  FileText,
  FileUp,
  GripVertical,
  HelpCircle,
  MoreVertical,
  Plus,
  Rocket,
  Save,
  Settings,
  Trash2,
  Video
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

// Types for the course builder       
type LessonType = "video" | "text" | "quiz" | "assignment" | null;

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  duration?: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

const InstructorCourseBuilderView = () => {
  const t = useTranslations("CourseBuilder");
  const [sections, setSections] = useState<Section[]>([
    {
      id: "s1",
      title: "Introduction",
      lessons: [
        { id: "l1", title: "Course Overview", type: "video", content: "overview-video.mp4" },
        { id: "l2", title: "Installation Guide", type: "text", content: "Install Node.js and VS Code..." }
      ]
    },
    {
      id: "s2",
      title: "Core Concepts",
      lessons: [
        { id: "l3", title: "Components & Props", type: "video", content: "props-video.mp4" },
        { id: "l4", title: "State Management", type: "video", content: "state-video.mp4" }
      ]
    }
  ]);

  const [activeLessonId, setActiveLessonId] = useState<string | null>("l1");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Find active item
  const activeLesson = sections
    .flatMap(s => s.lessons)
    .find(l => l.id === activeLessonId);

  const activeSection = sections.find(s => s.id === activeSectionId);

  // Handlers
  const addSection = () => {
    const newSection: Section = {
      id: `s-${Date.now()}`,
      title: "New Section",
      lessons: []
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newSection.id);
    setActiveLessonId(null);
  };

  const addLesson = (sectionId: string) => {
    const newLesson: Lesson = {
      id: `l-${Date.now()}`,
      title: "New Lesson",
      type: "text",
      content: ""
    };
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, lessons: [...s.lessons, newLesson] }
        : s
    ));
    setActiveLessonId(newLesson.id);
    setActiveSectionId(null);
  };

  const updateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setSections(sections.map(s => ({
      ...s,
      lessons: s.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
    })));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
    if (activeSectionId === sectionId) setActiveSectionId(null);
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) }
        : s
    ));
    if (activeLessonId === lessonId) setActiveLessonId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Bar */}
      <header className="border-b bg-background px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" >
            <Link href="/instructor/courses">
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("back_to_courses")}</span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <h1 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md">
            Mastering React Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Save className="h-4 w-4 mr-2" />
            {t("save_draft")}
          </Button>
          <Button size="sm">
            <Rocket className="h-4 w-4 mr-2" />
            {t("publish")}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Sidebar: Curriculum Structure */}
        <aside className="w-full lg:w-80 border-r bg-muted/30 flex flex-col h-[40vh] lg:h-full">
          <div className="p-4 border-b bg-background flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              {t("sections.title")}
            </h2>
            <Button size="icon" variant="outline" className="h-8 w-8" onClick={addSection}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-4">
              {sections.map((section) => (
                <Reorder.Item
                  key={section.id}
                  value={section}
                  className="space-y-2"
                >
                  <div
                    className={cn(
                      "group flex items-center justify-between p-2 rounded-md border bg-background transition-all hover:border-primary/50",
                      activeSectionId === section.id && "ring-2 ring-primary border-transparent"
                    )}
                    onClick={() => {
                      setActiveSectionId(section.id);
                      setActiveLessonId(null);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      <span className="font-medium truncate text-sm">{section.title}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger >
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => addLesson(section.id)}>
                          <Plus className="h-4 w-4 mr-2" /> {t("sections.add_lesson")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteSection(section.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="pl-6 space-y-2 border-l-2 border-muted ml-4">
                    <Reorder.Group
                      axis="y"
                      values={section.lessons}
                      onReorder={(newLessons) => {
                        setSections(sections.map(s =>
                          s.id === section.id ? { ...s, lessons: newLessons } : s
                        ));
                      }}
                      className="space-y-2"
                    >
                      {section.lessons.map((lesson) => (
                        <Reorder.Item
                          key={lesson.id}
                          value={lesson}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-between p-2 rounded-md border text-sm cursor-pointer transition-all hover:bg-muted/50",
                              activeLessonId === lesson.id ? "bg-primary/5 border-primary" : "bg-background"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLessonId(lesson.id);
                              setActiveSectionId(null);
                            }}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {lesson.type === "video" && <Video className="h-3.5 w-3.5 text-blue-500" />}
                              {lesson.type === "text" && <FileText className="h-3.5 w-3.5 text-orange-500" />}
                              {lesson.type === "quiz" && <HelpCircle className="h-3.5 w-3.5 text-green-500" />}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLesson(section.id, lesson.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-8 text-muted-foreground hover:text-primary"
                      onClick={() => addLesson(section.id)}
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      {t("sections.add_lesson")}
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {sections.length === 0 && (
              <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">{t("sections.empty")}</p>
                <Button variant="outline" size="sm" onClick={addSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("sections.add_section")}
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content: Item Editor */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeLesson ? (
              <motion.div
                key={`lesson-${activeLesson.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-semibold">
                    <Badge variant="outline" className="rounded-sm px-1 font-bold">
                      LESSON
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold">{t("lesson.title")}</h2>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="lesson-title">{t("lesson.name")}</Label>
                    <Input
                      id="lesson-title"
                      value={activeLesson.title}
                      onChange={(e) => updateLesson(activeLesson.id, { title: e.target.value })}
                      placeholder={t("lesson.name_placeholder")}
                      className="text-lg font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>{t("lesson.type")}</Label>
                      <Select
                        value={activeLesson.type}
                        onValueChange={(value: LessonType) => updateLesson(activeLesson.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-blue-500" />
                              {t("lesson.type_video")}
                            </div>
                          </SelectItem>
                          <SelectItem value="text">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-orange-500" />
                              {t("lesson.type_text")}
                            </div>
                          </SelectItem>
                          <SelectItem value="quiz">
                            <div className="flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-green-500" />
                              {t("lesson.type_quiz")}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {activeLesson.type === "video" && (
                    <div className="grid gap-4">
                      <Label>{t("lesson.content")}</Label>
                      <div className="border-2 border-dashed rounded-xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileUp className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{t("lesson.upload_video")}</p>
                          <p className="text-sm text-muted-foreground">MP4, MOV, WEBM (Max 2GB)</p>
                        </div>
                        {activeLesson.content && (
                          <div className="mt-4 p-2 bg-muted rounded-md flex items-center justify-between text-xs">
                            <span className="truncate">{activeLesson.content}</span>
                            <Badge variant="default" className="ml-2">Uploaded</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeLesson.type === "text" && (
                    <div className="grid gap-2">
                      <Label>{t("lesson.content")}</Label>
                      <Textarea
                        value={activeLesson.content}
                        onChange={(e) => updateLesson(activeLesson.id, { content: e.target.value })}
                        placeholder="Write your lesson content here..."
                        className="min-h-[300px] resize-y"
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t("lesson.prerequisite")}</Label>
                        <p className="text-xs text-muted-foreground">{t("lesson.prerequisite_hint")}</p>
                      </div>
                      <Select defaultValue="none">
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select lesson" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {sections.flatMap(s => s.lessons)
                            .filter(l => l.id !== activeLesson.id)
                            .map(l => (
                              <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeSection ? (
              <motion.div
                key={`section-${activeSection.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm uppercase tracking-wider font-semibold">
                    <Badge variant="outline" className="rounded-sm px-1 font-bold">
                      SECTION
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold">Edit Section</h2>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="section-title">{t("sections.section_name")}</Label>
                    <Input
                      id="section-title"
                      value={activeSection.title}
                      onChange={(e) => updateSection(activeSection.id, { title: e.target.value })}
                      placeholder={t("sections.section_placeholder")}
                      className="text-lg font-medium"
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => addLesson(activeSection.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("sections.add_lesson")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div className="max-w-md space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Settings className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Welcome to Course Builder</h3>
                    <p className="text-muted-foreground text-sm">
                      Select a section or lesson from the sidebar to start editing its content, or add a new one to grow your course.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default InstructorCourseBuilderView;
