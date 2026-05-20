"use client";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { courseApi } from "@/features/course/infrastructure/course.api";
import { CourseSettingsForm } from "@/features/course/presentation/components/course-settings-form";
import { useCourseCurriculum } from "@/features/course/presentation/hooks/use-course-curriculum";
import { useCourseDetail } from "@/features/course/presentation/hooks/use-course-detail";
import { useLessonMutations, useSectionMutations } from "@/features/course/presentation/hooks/use-curriculum-mutations";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import {
  ChevronLeft,
  FileText,
  FileUp,
  GripVertical,
  HelpCircle,
  Loader2,
  MoreVertical,
  Plus,
  Rocket,
  Save,
  Settings,
  Trash2,
  Video
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Lesson, Section } from "@/features/course/domain/course.types";

// Validation Schemas
const sectionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
});

const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  type: z.enum(["video", "text", "quiz", "assignment"]),
  content: z.string().optional(),
  video_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  is_preview: z.boolean(),
});

type SectionFormValues = z.infer<typeof sectionSchema>;
type LessonFormValues = z.infer<typeof lessonSchema>;

const InstructorCourseBuilderView = () => {
  const t = useTranslations("CourseBuilder");
  const params = useParams();
  const courseId = params.id as string;

  const { data: course, isLoading: isLoadingCourse, isError: isErrorCourse } = useCourseDetail(courseId);
  const { data: curriculum, isLoading: isLoadingCurriculum } = useCourseCurriculum(courseId);
  const { createSection, updateSection, deleteSection } = useSectionMutations(courseId);
  const { createLesson, updateLesson, deleteLesson } = useLessonMutations(courseId);

  const [sections, setSections] = useState<Section[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [sectionToDeleteId, setSectionToDeleteId] = useState<string | null>(null);
  const [lessonToDeleteId, setLessonToDeleteId] = useState<string | null>(null);

  const addSectionForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (isAddSectionOpen) {
      addSectionForm.reset({ title: "" });
    }
  }, [isAddSectionOpen, addSectionForm]);

  // Sync local state with curriculum data
  useEffect(() => {
    if (curriculum) {
      setSections(curriculum);
    }
  }, [curriculum]);

  const hasOrderChanged = JSON.stringify(sections.map(s => ({
    id: s.id,
    lessons: s.lessons?.map(l => l.id)
  }))) !== JSON.stringify(curriculum?.map(s => ({
    id: s.id,
    lessons: s.lessons?.map(l => l.id)
  })));

  const handleSaveOrder = async () => {
    // Update each section's order
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.orderIndex !== i + 1) {
        await updateSection.mutateAsync({
          id: section.id,
          data: { title: section.title, orderIndex: i + 1 } as any
        });
      }
      // Update lessons order within section
      if (section.lessons) {
        for (let j = 0; j < section.lessons.length; j++) {
          const lesson = section.lessons[j];
          if (lesson.order !== j + 1) {
            await updateLesson.mutateAsync({ id: lesson.id, data: { order: j + 1 } });
          }
        }
      }
    }
    toast.success("Curriculum order saved");
  };

  const isLoading = isLoadingCourse || isLoadingCurriculum;
  const isError = isErrorCourse || !course;

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <header className="h-16 border-b flex items-center px-6">
          <Skeleton className="h-8 w-48" />
        </header>
        <div className="flex flex-1">
          <aside className="w-80 border-r p-4">
            <Skeleton className="h-full w-full" />
          </aside>
          <main className="flex-1 p-8">
            <Skeleton className="h-12 w-64 mb-6" />
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive font-semibold">Error loading course.</p>
        <Button asChild>
          <Link href="/instructor/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  // Find active item
  const activeLesson = sections
    .flatMap(s => s.lessons)
    .find(l => l.id === activeLessonId);
  console.log("activeLesson", activeLesson);
  console.log("sectionnn", sections);

  const activeSection = sections.find(s => s.id === activeSectionId);

  const handleAddSection = () => {
    setIsAddSectionOpen(true);
  };

  const onAddSectionSubmit = (values: SectionFormValues) => {
    createSection.mutate({
      title: values.title,
    }, {
      onSuccess: () => {
        setIsAddSectionOpen(false);
        addSectionForm.reset();
      }
    });
  };

  const handleAddLesson = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    createLesson.mutate({
      title: "New Lesson",
      sectionId: sectionId,
      type: "text",
      order: (section?.lessons?.length || 0) + 1
    });
  };

  const handleDeleteSection = (id: string) => {
    setSectionToDeleteId(id);
  };

  const handleDeleteLesson = (id: string) => {
    setLessonToDeleteId(id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header Bar */}
      <header className="border-b bg-background px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses">
            <Button variant="ghost" size="sm" >
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t("back_to_courses")}</span>
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <h1 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md">
            {course.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showSettings ? "secondary" : "outline"}
            size="sm"
            className="hidden sm:flex"
            onClick={() => {
              setShowSettings(!showSettings);
              setActiveLessonId(null);
              setActiveSectionId(null);
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showSettings ? "Curriculum" : "Settings"}
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
            <div className="flex gap-2">
              {hasOrderChanged && (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={handleSaveOrder} title="Save Order">
                  <Save className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleAddSection}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
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
                      "group flex items-center justify-between p-2 rounded-md border bg-background transition-all hover:border-primary/50 cursor-pointer",
                      activeSectionId === section.id && "ring-2 ring-primary border-transparent",
                      showSettings && "opacity-50"
                    )}
                    onClick={() => {
                      if (showSettings) setShowSettings(false);
                      setActiveSectionId(section.id);
                      setActiveLessonId(null);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      <span className="font-medium truncate text-sm">{section.title}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddLesson(section.id); }}>
                          <Plus className="h-4 w-4 mr-2" /> {t("sections.add_lesson")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="pl-6 space-y-2 border-l-2 border-muted ml-4">
                    <Reorder.Group
                      axis="y"
                      values={section.lessons || []}
                      onReorder={(newLessons) => {
                        setSections(sections.map(s =>
                          s.id === section.id ? { ...s, lessons: newLessons } : s
                        ));
                      }}
                      className="space-y-2"
                    >
                      {(section.lessons || []).map((lesson: Lesson) => (
                        <Reorder.Item
                          key={lesson.id}
                          value={lesson}
                        >
                          <div
                            className={cn(
                              "group flex items-center justify-between p-2 rounded-md border text-sm cursor-pointer transition-all hover:bg-muted/50",
                              activeLessonId === lesson.id ? "bg-primary/5 border-primary" : "bg-background"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLessonId(lesson.id);
                              setActiveSectionId(null);
                              if (showSettings) setShowSettings(false);
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
                                handleDeleteLesson(lesson.id);
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
                      onClick={() => handleAddLesson(section.id)}
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
                <Button variant="outline" size="sm" onClick={handleAddSection}>
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
            {showSettings ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Course Settings</h2>
                  <p className="text-muted-foreground">Manage your course's public information and metadata.</p>
                </div>
                <CourseSettingsForm course={course} />
              </motion.div>
            ) : activeLesson ? (
              <LessonEditor
                lesson={activeLesson}
                key={`lesson-${activeLesson.id}`}
                onUpdate={(values) => updateLesson.mutate({
                  id: activeLesson.id,
                  data: {
                    title: values.title,
                    type: values.type,
                    content: values.content,
                    videoUrl: values.video_url,
                    isPreview: values.is_preview
                  }
                })}
                isUpdating={updateLesson.isPending}
                sections={sections}
              />
            ) : activeSection ? (
              <SectionEditor
                key={`section-${activeSection.id}`}
                section={activeSection}
                onUpdate={(data) => updateSection.mutate({ id: activeSection.id, data })}
                isUpdating={updateSection.isPending}
                onAddLesson={() => handleAddLesson(activeSection.id)}
              />
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

      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("sections.add_section")}</DialogTitle>
            <DialogDescription>
              {t("sections.add_section_description")}
            </DialogDescription>
          </DialogHeader>
          <Form {...addSectionForm}>
            <form onSubmit={addSectionForm.handleSubmit(onAddSectionSubmit)} className="space-y-4 pt-2">
              <FormField
                control={addSectionForm.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sections.section_name")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("sections.section_placeholder")}
                        disabled={createSection.isPending}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddSectionOpen(false)}
                  disabled={createSection.isPending}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={createSection.isPending}>
                  {createSection.isPending ? t("creating") : t("create")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={sectionToDeleteId !== null}
        onOpenChange={(open) => !open && setSectionToDeleteId(null)}
        title={t("sections.delete_title")}
        description={t("sections.delete_description")}
        confirmText={deleteSection.isPending ? t("deleting") : t("delete")}
        cancelText={t("cancel")}
        confirmVariant="destructive"
        isLoading={deleteSection.isPending}
        onConfirm={async () => {
          if (sectionToDeleteId) {
            await deleteSection.mutateAsync(sectionToDeleteId);
            if (activeSectionId === sectionToDeleteId) setActiveSectionId(null);
            setSectionToDeleteId(null);
          }
        }}
      />

      <ConfirmDialog
        open={lessonToDeleteId !== null}
        onOpenChange={(open) => !open && setLessonToDeleteId(null)}
        title={t("lesson.delete_title")}
        description={t("lesson.delete_description")}
        confirmText={deleteLesson.isPending ? t("deleting") : t("delete")}
        cancelText={t("cancel")}
        confirmVariant="destructive"
        isLoading={deleteLesson.isPending}
        onConfirm={async () => {
          if (lessonToDeleteId) {
            await deleteLesson.mutateAsync(lessonToDeleteId);
            if (activeLessonId === lessonToDeleteId) setActiveLessonId(null);
            setLessonToDeleteId(null);
          }
        }}
      />
    </div>
  );
};


interface SectionEditorProps {
  section: Section;
  onUpdate: (data: SectionFormValues) => void;
  isUpdating: boolean;
  onAddLesson: () => void;
}

const SectionEditor = ({ section, onUpdate, isUpdating, onAddLesson }: SectionEditorProps) => {
  const t = useTranslations("CourseBuilder");

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: section.title,
    },
  });


  return (
    <motion.div
      key={`section-${section.id}`}
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-6">
          <FormField
            control={form.control as any}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sections.section_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isUpdating}
                    placeholder={t("sections.section_placeholder")}
                    className="text-lg font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onAddLesson}>
              <Plus className="h-4 w-4 mr-2" />
              {t("sections.add_lesson")}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

interface LessonEditorProps {
  lesson: Lesson;
  onUpdate: (data: LessonFormValues) => void;
  isUpdating: boolean;
  sections: Section[];
}

const LessonEditor = ({ lesson, onUpdate, isUpdating, sections }: LessonEditorProps) => {
  const t = useTranslations("CourseBuilder");
  console.log("lessonn", lesson);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title || "",
      type: lesson.type || "text",
      content: lesson.content || "",
      video_url: lesson.videoUrl || lesson.contentUrl || "",
      is_preview: lesson.isPreview ?? false,
    },
  });
  const previewUrl = lesson?.contentUrl || form.watch("video_url");
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }
    if (file.size > 1024 * 1024 * 1024 * 200) {
      toast.error("Video size must be less than 200MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const result = await courseApi.uploadVideo(file);
      form.setValue("video_url", result.playbackUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Video uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading video:", error);
      const errMsg = error?.response?.data?.message || "Failed to upload video. Please try again.";
      setUploadError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  return (
    <motion.div
      key={`lesson-${lesson.id}`}
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-6">
          <FormField
            control={form.control as any}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lesson.name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("lesson.name_placeholder")}
                    className="text-lg font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control as any}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lesson.type")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("type") === "video" && (
            <div className="space-y-4">
              <FormField
                control={form.control as any}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." disabled={isUploading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleVideoFileChange}
                disabled={isUploading}
              />

              {isUploading ? (
                <div className="border-2 border-dashed border-primary rounded-xl p-12 text-center space-y-4 bg-primary/5 animate-pulse">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-primary">Uploading Video...</p>
                    <p className="text-xs text-muted-foreground">This may take a moment depending on the file size.</p>
                  </div>
                </div>
              ) : previewUrl ? (
                <div className="space-y-4">
                  <Label>Video Preview</Label>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-border">
                    <video
                      key={previewUrl}
                      src={previewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate max-w-[70%]">
                      {lesson?.contentUrl ? (
                        <span className="text-green-600 font-medium">✓ Video đã được xử lý</span>
                      ) : (
                        `Playback URL: ${previewUrl}`
                      )}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      Change Video
                    </Button>
                  </div>
                </div>
              ) : (
                // ✅ Chưa có video nào
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{t("lesson.upload_video")}</p>
                    <p className="text-sm text-muted-foreground">MP4, MOV, WEBM (Max 2GB)</p>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-sm font-medium text-destructive mt-2">{uploadError}</p>
              )}
            </div>
          )}

          {form.watch("type") === "text" && (
            <FormField
              control={form.control as any}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lesson.content")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write your lesson content here..."
                      className="min-h-[300px] resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center justify-between pt-4 border-t">
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
                  .filter(l => l.id !== lesson.id)
                  .map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {isUpdating ? "Saving..." : "Save Lesson"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default InstructorCourseBuilderView;
