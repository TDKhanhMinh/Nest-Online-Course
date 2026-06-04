"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Section } from "@/features/course/domain/course.types";
import { CourseSettingsForm } from "@/features/course/presentation/components/course-settings-form";
import { useCourseCurriculum } from "@/features/course/presentation/hooks/use-course-curriculum";
import { useCourseDetail } from "@/features/course/presentation/hooks/use-course-detail";
import { usePublishCourse } from "@/features/course/presentation/hooks/use-course-mutations";
import {
  useLessonMutations,
  useSectionMutations,
} from "@/features/course/presentation/hooks/use-curriculum-mutations";
import { Link } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { CourseBuilderAddSectionDialog } from "./course-builder/course-builder-add-section-dialog";
import {
  sectionSchema,
  type LessonFormValues,
  type SectionFormValues,
} from "./course-builder/course-builder-form.schemas";
import { CourseBuilderHeader } from "./course-builder/course-builder-header";
import { CourseBuilderLessonEditor } from "./course-builder/course-builder-lesson-editor";
import { CourseBuilderSectionEditor } from "./course-builder/course-builder-section-editor";
import { CourseBuilderSidebar } from "./course-builder/course-builder-sidebar";

const InstructorCourseBuilderView = () => {
  const t = useTranslations("CourseBuilder");
  const params = useParams();
  const courseId = params.id as string;

  const {
    data: course,
    isLoading: isLoadingCourse,
    isError: isErrorCourse,
  } = useCourseDetail(courseId);
  const { data: curriculum, isLoading: isLoadingCurriculum } =
    useCourseCurriculum(courseId);
  const { createSection, updateSection, deleteSection } =
    useSectionMutations(courseId);
  const { createLesson, updateLesson, deleteLesson } =
    useLessonMutations(courseId);
  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse({
    successMessage: t("messages.submit_review_success"),
  });

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [sectionToDeleteId, setSectionToDeleteId] = useState<string | null>(
    null,
  );
  const [lessonToDeleteId, setLessonToDeleteId] = useState<string | null>(null);
  const [sectionDraft, setSectionDraft] = useState<{
    baseSignature: string;
    sections: Section[];
  } | null>(null);

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

  const curriculumSections = curriculum ?? [];
  const curriculumSignature = JSON.stringify(
    curriculumSections.map((section) => ({
      id: section.id,
      lessons: section.lessons?.map((lesson) => lesson.id),
    })),
  );

  const sections =
    sectionDraft?.baseSignature === curriculumSignature
      ? sectionDraft.sections
      : curriculumSections;

  const hasOrderChanged =
    JSON.stringify(
      sections.map((section) => ({
        id: section.id,
        lessons: section.lessons?.map((lesson) => lesson.id),
      })),
    ) !== curriculumSignature;

  const handleSaveOrder = async () => {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.orderIndex !== i + 1) {
        await updateSection.mutateAsync({
          id: section.id,
          data: { title: section.title, orderIndex: i + 1 },
        });
      }

      if (section.lessons) {
        for (let j = 0; j < section.lessons.length; j++) {
          const lesson = section.lessons[j];
          if (lesson.order !== j + 1) {
            await updateLesson.mutateAsync({
              id: lesson.id,
              data: { order: j + 1 },
            });
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

  const activeLesson = sections
    .flatMap((section) => section.lessons)
    .find((lesson) => lesson.id === activeLessonId);
  const activeSection = sections.find((section) => section.id === activeSectionId);

  const handleAddSection = () => {
    setIsAddSectionOpen(true);
  };

  const onAddSectionSubmit = (values: SectionFormValues) => {
    createSection.mutate(
      {
        title: values.title,
      },
      {
        onSuccess: () => {
          setIsAddSectionOpen(false);
          addSectionForm.reset();
        },
      },
    );
  };

  const handleAddLesson = (sectionId: string) => {
    const section = sections.find((item) => item.id === sectionId);
    createLesson.mutate({
      title: "New Lesson",
      sectionId,
      type: "text",
      order: (section?.lessons?.length || 0) + 1,
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
      <CourseBuilderHeader
        courseTitle={course.title}
        courseStatus={course.status}
        showSettings={showSettings}
        isPublishing={isPublishing}
        onToggleSettings={() => {
          setShowSettings(!showSettings);
          setActiveLessonId(null);
          setActiveSectionId(null);
        }}
        onPublish={() => publishCourse(courseId)}
      />

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <CourseBuilderSidebar
          sections={sections}
          activeLessonId={activeLessonId}
          activeSectionId={activeSectionId}
          showSettings={showSettings}
          hasOrderChanged={hasOrderChanged}
          onSaveOrder={handleSaveOrder}
          onAddSection={handleAddSection}
          onSelectSection={(sectionId) => {
            if (showSettings) setShowSettings(false);
            setActiveSectionId(sectionId);
            setActiveLessonId(null);
          }}
          onSelectLesson={(lessonId) => {
            if (showSettings) setShowSettings(false);
            setActiveLessonId(lessonId);
            setActiveSectionId(null);
          }}
          onAddLesson={handleAddLesson}
          onDeleteSection={handleDeleteSection}
          onDeleteLesson={handleDeleteLesson}
          onReorderSections={(nextSections) =>
            setSectionDraft({
              baseSignature: curriculumSignature,
              sections: nextSections,
            })
          }
          onReorderLessons={(sectionId, lessons) => {
            setSectionDraft({
              baseSignature: curriculumSignature,
              sections: sections.map((section) =>
                section.id === sectionId ? { ...section, lessons } : section,
              ),
            });
          }}
        />

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
                  <p className="text-muted-foreground">
                    Manage your course&apos;s public information and metadata.
                  </p>
                </div>
                <CourseSettingsForm course={course} />
              </motion.div>
            ) : activeLesson ? (
              <CourseBuilderLessonEditor
                lesson={activeLesson}
                key={`lesson-${activeLesson.id}`}
                onUpdate={(values: LessonFormValues) =>
                  updateLesson.mutateAsync({
                    id: activeLesson.id,
                    data: {
                      title: values.title,
                      type: values.type,
                      content: values.content,
                      videoUrl: values.video_url,
                      isPreview: values.is_preview,
                    },
                  })
                }
                isUpdating={updateLesson.isPending}
                sections={sections}
                courseId={courseId}
              />
            ) : activeSection ? (
              <CourseBuilderSectionEditor
                key={`section-${activeSection.id}`}
                section={activeSection}
                onUpdate={(data) =>
                  updateSection.mutate({ id: activeSection.id, data })
                }
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
                    <h3 className="text-xl font-semibold">
                      Welcome to Course Builder
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Select a section or lesson from the sidebar to start
                      editing its content, or add a new one to grow your course.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CourseBuilderAddSectionDialog
        open={isAddSectionOpen}
        onOpenChange={setIsAddSectionOpen}
        form={addSectionForm}
        onSubmit={onAddSectionSubmit}
        isCreating={createSection.isPending}
      />

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

export default InstructorCourseBuilderView;
