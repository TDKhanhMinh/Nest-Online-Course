"use client";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { Lesson, Section } from "@/features/course/domain/course.types";
import { useUploadCourseVideo } from "@/features/course/presentation/hooks/use-course-upload";
import type { InstructorQuiz } from "@/features/instructor/application/instructor-quiz.mapper";
import {
  useInstructorQuizzes,
  useUpdateInstructorQuizLesson,
} from "@/features/instructor/presentation/hooks/use-instructor-quizzes";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  FileText,
  FileUp,
  HelpCircle,
  Loader2,
  Plus,
  Save,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  lessonSchema,
  quizMatchesSearch,
  type LessonFormValues,
} from "./course-builder-form.schemas";

interface CourseBuilderLessonEditorProps {
  lesson: Lesson;
  onUpdate: (data: LessonFormValues) => Promise<unknown>;
  isUpdating: boolean;
  sections: Section[];
  courseId: string;
}

export const CourseBuilderLessonEditor = ({
  lesson,
  onUpdate,
  isUpdating,
  sections,
  courseId,
}: CourseBuilderLessonEditorProps) => {
  const t = useTranslations("CourseBuilder");
  const tQuizBank = useTranslations("QuizBank");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [quizSearch, setQuizSearch] = useState("");
  const [selectedQuizOverrideId, setSelectedQuizOverrideId] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deferredQuizSearch = useDeferredValue(quizSearch);

  const updateQuizLessonMutation = useUpdateInstructorQuizLesson();
  const uploadVideoMutation = useUploadCourseVideo();
  const {
    data: quizBankResponse,
    isLoading: isLoadingQuizBank,
    isError: isQuizBankError,
  } = useInstructorQuizzes({
    page: 1,
    limit: 100,
    order: "DESC",
  });

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

  const lessonType = useWatch({
    control: form.control,
    name: "type",
  });
  const watchedVideoUrl = useWatch({
    control: form.control,
    name: "video_url",
  });

  const previewUrl = lesson.contentUrl || watchedVideoUrl;
  const allQuizzes = quizBankResponse?.data ?? [];
  const lessonQuiz =
    allQuizzes.find((quiz) => quiz.lessonId === lesson.id) ?? null;
  const selectedQuizId = selectedQuizOverrideId ?? lessonQuiz?.id ?? null;
  const selectedQuiz =
    allQuizzes.find((quiz) => quiz.id === selectedQuizId) ?? null;
  const hasReplacementConflict =
    lessonType === "quiz" &&
    Boolean(
      lessonQuiz &&
        selectedQuiz &&
        lessonQuiz.id !== selectedQuiz.id,
    );
  const availableQuizzes = allQuizzes.filter((quiz) => !quiz.lessonId);
  const filteredQuizzes = availableQuizzes.filter((quiz) =>
    quizMatchesSearch(quiz, deferredQuizSearch),
  );
  const isSubmittingQuiz = updateQuizLessonMutation.isPending;
  const isUploading = uploadVideoMutation.isPending;
  const isSubmitting = isUpdating || isUploading || isSubmittingQuiz;

  useEffect(() => {
    form.reset({
      title: lesson.title || "",
      type: lesson.type || "text",
      content: lesson.content || "",
      video_url: lesson.videoUrl || lesson.contentUrl || "",
      is_preview: lesson.isPreview ?? false,
    });
  }, [
    form,
    lesson.content,
    lesson.contentUrl,
    lesson.id,
    lesson.isPreview,
    lesson.title,
    lesson.type,
    lesson.videoUrl,
  ]);

  const handleVideoFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      setUploadError(null);
      const result = await uploadVideoMutation.mutateAsync(file);
      form.setValue("video_url", result.playbackUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Video uploaded successfully!");
    } catch (error: unknown) {
      const errMsg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response!
              .data!.message!
          : "Failed to upload video. Please try again.";
      setUploadError(errMsg);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLessonSubmit = async (values: LessonFormValues) => {
    if (values.type === "quiz" && !selectedQuiz) {
      toast.error(t("lesson.quiz_bank.selection_required"));
      return;
    }

    if (hasReplacementConflict) {
      toast.error(t("lesson.quiz_bank.replace_blocked"));
      return;
    }

    try {
      await onUpdate(values);
    } catch {
      return;
    }

    if (values.type !== "quiz" || !selectedQuiz) {
      return;
    }

    try {
      if (selectedQuiz.lessonId === lesson.id) {
        return;
      }

      await updateQuizLessonMutation.mutateAsync({
        quizId: selectedQuiz.id,
        data: {
          lessonId: lesson.id,
        },
        previousLessonId: selectedQuiz.lessonId || undefined,
      });

      toast.success(t("lesson.quiz_bank.attach_success"));
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : t("lesson.quiz_bank.attach_failed");
      toast.error(message);
    }
  };

  const handleDetachQuiz = async () => {
    if (!lessonQuiz) {
      return;
    }

    try {
      await updateQuizLessonMutation.mutateAsync({
        quizId: lessonQuiz.id,
        data: {
          lessonId: null,
        },
        previousLessonId: lesson.id,
      });

      setSelectedQuizOverrideId(null);
      toast.success(t("lesson.quiz_bank.detach_success"));
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : t("lesson.quiz_bank.detach_failed");
      toast.error(message);
    }
  };

  const renderQuizMeta = (quiz: InstructorQuiz) => {
    return (
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">
          {t("lesson.quiz_bank.question_count", {
            count: quiz.questions.length,
          })}
        </Badge>
        <Badge variant="outline">
          {t("lesson.quiz_bank.lesson_id", {
            id: quiz.lessonId ?? "-",
          })}
        </Badge>
        <Badge variant="secondary">
          {tQuizBank("time_limit", {
            count: quiz.timeLimit,
          })}
        </Badge>
        <Badge variant="secondary">
          {tQuizBank("passing_score", {
            count: quiz.passingScore,
          })}
        </Badge>
        <Badge variant="secondary">
          {tQuizBank("attempts", {
            count: quiz.maxAttempts,
          })}
        </Badge>
      </div>
    );
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
        <form
          onSubmit={form.handleSubmit(handleLessonSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
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
              control={form.control}
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

          {lessonType === "video" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://..."
                        disabled={isUploading}
                      />
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
                    <p className="font-semibold text-primary">
                      Uploading Video...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This may take a moment depending on the file size.
                    </p>
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
                      {lesson.contentUrl ? (
                        <span className="text-green-600 font-medium">
                          Video đã được xử lý
                        </span>
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
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{t("lesson.upload_video")}</p>
                    <p className="text-sm text-muted-foreground">
                      MP4, MOV, WEBM (Max 100MB)
                    </p>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {uploadError}
                </p>
              )}
            </div>
          )}

          {lessonType === "text" && (
            <FormField
              control={form.control}
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

          {lessonType === "quiz" && (
            <Card className="border-brand-border bg-brand-card/50">
              <CardHeader className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>{t("lesson.quiz_bank.title")}</CardTitle>
                    <CardDescription>
                      {t("lesson.quiz_bank.description")}
                    </CardDescription>
                  </div>
                  <Button asChild type="button" variant="outline" size="sm">
                    <Link
                      href={{
                        pathname: "/instructor/quizzes/create",
                        query: {
                          lessonId: lesson.id,
                          courseId,
                        },
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("lesson.quiz_bank.create_new")}
                    </Link>
                  </Button>
                </div>

                {!lessonQuiz && (
                  <div className="relative">
                    <Input
                      value={quizSearch}
                      onChange={(event) => setQuizSearch(event.target.value)}
                      placeholder={t("lesson.quiz_bank.search_placeholder")}
                      className="bg-brand-bg/50 border-brand-border"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedQuiz && (
                  <div className="rounded-xl border border-brand-amber/30 bg-brand-amber/10 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{selectedQuiz.title}</p>
                          <Badge variant="secondary">
                            {t("lesson.quiz_bank.selected")}
                          </Badge>
                          {selectedQuiz.lessonId === lesson.id && (
                            <Badge variant="outline">
                              {t("lesson.quiz_bank.attached")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedQuiz.description ||
                            t("lesson.quiz_bank.no_description")}
                        </p>
                        {renderQuizMeta(selectedQuiz)}
                        {hasReplacementConflict && lessonQuiz && (
                          <p className="text-sm font-medium text-destructive">
                            {t("lesson.quiz_bank.replace_blocked_with_title", {
                              title: lessonQuiz.title,
                            })}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedQuiz.lessonId === lesson.id
                          ? t("lesson.quiz_bank.already_attached")
                          : t("lesson.quiz_bank.will_attach")}
                      </p>
                    </div>
                    {selectedQuiz.lessonId === lesson.id && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDetachQuiz}
                          disabled={isSubmittingQuiz}
                        >
                          {t("lesson.quiz_bank.detach")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {!lessonQuiz && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {isLoadingQuizBank &&
                        Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className="rounded-xl border border-brand-border p-4"
                          >
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="mt-2 h-4 w-full" />
                            <Skeleton className="mt-3 h-4 w-32" />
                          </div>
                        ))}

                      {!isLoadingQuizBank && isQuizBankError && (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                          {t("lesson.quiz_bank.load_error")}
                        </div>
                      )}

                      {!isLoadingQuizBank &&
                        !isQuizBankError &&
                        filteredQuizzes.map((quiz) => {
                          const isSelected = quiz.id === selectedQuizId;
                          const isAttached = quiz.lessonId === lesson.id;

                          return (
                            <button
                              key={quiz.id}
                              type="button"
                              onClick={() => setSelectedQuizOverrideId(quiz.id)}
                              className={cn(
                                "w-full rounded-xl border p-4 text-left transition-colors",
                                isSelected
                                  ? "border-brand-amber bg-brand-amber/10"
                                  : "border-brand-border bg-brand-bg/40 hover:border-brand-amber/40",
                              )}
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold">{quiz.title}</p>
                                    {isSelected && (
                                      <Badge variant="secondary">
                                        {t("lesson.quiz_bank.selected")}
                                      </Badge>
                                    )}
                                    {isAttached && (
                                      <Badge variant="outline">
                                        {t("lesson.quiz_bank.attached")}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {quiz.description ||
                                      t("lesson.quiz_bank.no_description")}
                                  </p>
                                  {renderQuizMeta(quiz)}
                                </div>
                              </div>
                            </button>
                          );
                        })}

                      {!isLoadingQuizBank &&
                        !isQuizBankError &&
                        filteredQuizzes.length === 0 && (
                          <div className="rounded-xl border border-dashed border-brand-border p-6 text-center text-sm text-muted-foreground">
                            {t("lesson.quiz_bank.empty")}
                          </div>
                        )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label>{t("lesson.prerequisite")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("lesson.prerequisite_hint")}
              </p>
            </div>
            <Select defaultValue="none">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {sections
                  .flatMap((section) => section.lessons)
                  .filter((item) => item.id !== lesson.id)
                  .map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || hasReplacementConflict}
            className="w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Lesson"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
