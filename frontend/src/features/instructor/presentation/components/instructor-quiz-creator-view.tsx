"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  GripVertical,
  Layout,
  ListChecks,
  Loader2,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { useCourseCurriculum } from "@/features/course/presentation/hooks/use-course-curriculum";
import {
  DifficultyLevel,
  QuestionType,
} from "../../infrastructure/instructor-question.api";
import type { InstructorQuiz } from "../../application/instructor-quiz.mapper";
import { useInstructorQuestions } from "../hooks/use-instructor-questions";
import {
  useAddQuestionToInstructorQuiz,
  useCreateOrUpdateInstructorQuiz,
  useInstructorQuizDetail,
  useRemoveQuestionFromInstructorQuiz,
} from "../hooks/use-instructor-quizzes";

interface QuizQuestionDraft {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty?: DifficultyLevel;
  points: number;
}

interface QuestionBankItem {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty?: DifficultyLevel;
  tags: string[];
}

interface QuestionBankApiNode {
  _id?: { value?: string };
  id?: string;
  props?: {
    title?: string;
    content?: string;
    type?: QuestionType;
    difficulty?: DifficultyLevel;
    tags?: string[];
  };
}

const defaultQuestionType = QuestionType.SINGLE_CHOICE;

const normalizeQuestionBankItem = (
  question: QuestionBankApiNode,
): QuestionBankItem => ({
  id: question?._id?.value || question?.id || "",
  title: question?.props?.title || "",
  content: question?.props?.content || "",
  type: question?.props?.type || defaultQuestionType,
  difficulty: question?.props?.difficulty,
  tags: question?.props?.tags || [],
});

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const createDraftQuestion = (
  question: QuestionBankItem,
  points = 1,
): QuizQuestionDraft => ({
  id: question.id,
  title: question.title,
  content: question.content,
  type: question.type,
  difficulty: question.difficulty,
  points,
});

const questionMatchesSearch = (question: QuestionBankItem, keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return [
    question.title,
    question.content,
    question.type,
    question.difficulty,
    question.tags.join(" "),
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedKeyword));
};

const buildRemoteQuestionDrafts = (
  quiz: InstructorQuiz,
  questionLookup: Map<string, QuestionBankItem>,
): QuizQuestionDraft[] =>
  quiz.questions
    .slice()
    .sort((left, right) => left.orderIndex - right.orderIndex)
    .map((question, index) => {
      const bankQuestion = questionLookup.get(question.questionId);

      if (bankQuestion) {
        return createDraftQuestion(bankQuestion, question.points);
      }

      return {
        id: question.questionId,
        title: `Question ${index + 1}`,
        content: question.questionId,
        type: defaultQuestionType,
        points: question.points,
      };
    });

const mergeRemoteAndLocalQuestions = (
  remoteQuestions: QuizQuestionDraft[],
  localQuestions: QuizQuestionDraft[],
) => {
  const localMap = new Map(
    localQuestions.map((question) => [question.id, question]),
  );
  const remoteIds = new Set(remoteQuestions.map((question) => question.id));

  const mergedRemote = remoteQuestions.map(
    (question) => localMap.get(question.id) || question,
  );
  const appendedLocal = localQuestions.filter(
    (question) => !remoteIds.has(question.id),
  );

  return [...mergedRemote, ...appendedLocal];
};

const resolveStringValue = (
  draftValue: string | null,
  fallbackValue?: string,
) => {
  if (draftValue !== null) {
    return draftValue;
  }

  return fallbackValue ?? "";
};

const resolveNumberValue = (
  draftValue: number | null,
  fallbackValue: number | undefined,
  defaultValue: number,
) => {
  if (draftValue !== null) {
    return draftValue;
  }

  if (typeof fallbackValue === "number" && Number.isFinite(fallbackValue)) {
    return fallbackValue;
  }

  return defaultValue;
};

const toQuizPayload = ({
  lessonId,
  title,
  description,
  timeLimit,
  passingScore,
  maxAttempts,
}: {
  lessonId: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
}) => ({
  lessonId,
  title: title.trim(),
  description: description.trim(),
  timeLimit,
  passingScore,
  maxAttempts,
});

const InstructorQuizCreatorView = () => {
  const t = useTranslations("QuizCreator");
  const searchParams = useSearchParams();

  const quizId = searchParams.get("quizId") || "";
  const initialLessonId = searchParams.get("lessonId") || "";
  const initialCourseId = searchParams.get("courseId") || "";
  const initialTitle = searchParams.get("title") || "";
  const initialDescription = searchParams.get("description") || "";
  const initialTimeLimit = searchParams.has("timeLimit")
    ? Number(searchParams.get("timeLimit"))
    : null;
  const initialPassingScore = searchParams.has("passingScore")
    ? Number(searchParams.get("passingScore"))
    : null;
  const initialMaxAttempts = searchParams.has("maxAttempts")
    ? Number(searchParams.get("maxAttempts"))
    : null;

  const [activeTab, setActiveTab] = useState("settings");
  const [lessonId, setLessonId] = useState<string | null>(
    initialLessonId || null,
  );
  const [courseId, setCourseId] = useState(initialCourseId);
  const [title, setTitle] = useState<string | null>(initialTitle || null);
  const [description, setDescription] = useState<string | null>(
    initialDescription || null,
  );
  const [timeLimit, setTimeLimit] = useState<number | null>(
    initialTimeLimit !== null &&
      Number.isFinite(initialTimeLimit) &&
      initialTimeLimit >= 1
      ? initialTimeLimit
      : null,
  );
  const [passingScore, setPassingScore] = useState<number | null>(
    initialPassingScore !== null &&
      Number.isFinite(initialPassingScore) &&
      initialPassingScore >= 1
      ? initialPassingScore
      : null,
  );
  const [maxAttempts, setMaxAttempts] = useState<number | null>(
    initialMaxAttempts !== null &&
      Number.isFinite(initialMaxAttempts) &&
      initialMaxAttempts >= 1
      ? initialMaxAttempts
      : null,
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState<
    QuizQuestionDraft[] | null
  >(null);
  const [selectedBankQuestionIds, setSelectedBankQuestionIds] = useState<
    string[]
  >([]);
  const [persistedQuiz, setPersistedQuiz] = useState<InstructorQuiz | null>(
    null,
  );

  const saveQuizMutation = useCreateOrUpdateInstructorQuiz();
  const addQuestionMutation = useAddQuestionToInstructorQuiz();
  const removeQuestionMutation = useRemoveQuestionFromInstructorQuiz();
  const {
    data: fetchedQuiz,
    isLoading: isLoadingQuizDetail,
    isError: isQuizDetailError,
  } = useInstructorQuizDetail(quizId || undefined);

  const {
    data: questionBankResponse,
    isLoading: isLoadingQuestionBank,
    isError: isQuestionBankError,
  } = useInstructorQuestions({
    courseId: courseId || undefined,
    page: 1,
    limit: 100,
  });

  const { data: curriculum } = useCourseCurriculum(courseId);

  const activeQuiz = persistedQuiz ?? fetchedQuiz ?? null;
  const resolvedLessonId = resolveStringValue(lessonId, activeQuiz?.lessonId);
  const resolvedTitle = resolveStringValue(title, activeQuiz?.title);
  const resolvedDescription = resolveStringValue(
    description,
    activeQuiz?.description,
  );
  const resolvedTimeLimit = resolveNumberValue(
    timeLimit,
    activeQuiz?.timeLimit,
    30,
  );
  const resolvedPassingScore = resolveNumberValue(
    passingScore,
    activeQuiz?.passingScore,
    70,
  );
  const resolvedMaxAttempts = resolveNumberValue(
    maxAttempts,
    activeQuiz?.maxAttempts,
    1,
  );

  const lessonContext = curriculum
    ?.flatMap((section) => section.lessons)
    .find((lesson) => lesson.id === resolvedLessonId);

  const questionBank = (questionBankResponse?.data || []).map(
    normalizeQuestionBankItem,
  );
  const questionLookup = new Map(
    questionBank.map((question) => [question.id, question]),
  );
  const remoteQuestionDrafts = activeQuiz
    ? buildRemoteQuestionDrafts(activeQuiz, questionLookup)
    : [];
  const effectiveSelectedQuestions = selectedQuestions ?? remoteQuestionDrafts;

  const filteredQuestionBank = questionBank.filter((question) =>
    questionMatchesSearch(question, searchKeyword),
  );

  const totalPoints = effectiveSelectedQuestions.reduce(
    (accumulator, question) => accumulator + question.points,
    0,
  );

  const validationItems = [
    {
      label: t("validation_items.title"),
      valid: resolvedTitle.trim().length > 0,
    },
    {
      label: t("validation_items.points"),
      valid:
        effectiveSelectedQuestions.length > 0 &&
        effectiveSelectedQuestions.every((question) => question.points >= 1),
    },
    {
      label: t("validation_items.pass_score"),
      valid: resolvedPassingScore >= 1,
    },
    {
      label: t("validation_items.lesson"),
      valid: resolvedLessonId.length > 0,
    },
  ];

  const canSave =
    resolvedLessonId.length > 0 &&
    resolvedTitle.trim().length > 0 &&
    resolvedTimeLimit >= 1 &&
    resolvedPassingScore >= 1 &&
    resolvedMaxAttempts >= 1 &&
    !isLoadingQuizDetail;

  const isSaving =
    saveQuizMutation.isPending ||
    addQuestionMutation.isPending ||
    removeQuestionMutation.isPending;

  const toggleQuestionSelection = (questionId: string, checked: boolean) => {
    setSelectedBankQuestionIds((previous) => {
      if (checked) {
        if (previous.includes(questionId)) {
          return previous;
        }

        return [...previous, questionId];
      }

      return previous.filter((id) => id !== questionId);
    });
  };

  const addSelectedQuestions = () => {
    if (selectedBankQuestionIds.length === 0) {
      return;
    }

    const existingIds = new Set(
      effectiveSelectedQuestions.map((question) => question.id),
    );
    const nextQuestions = selectedBankQuestionIds
      .map((questionId) => questionLookup.get(questionId))
      .filter(Boolean)
      .filter((question) => !existingIds.has(question!.id))
      .map((question) => createDraftQuestion(question!, 1));

    if (nextQuestions.length === 0) {
      setSelectedBankQuestionIds([]);
      return;
    }

    setSelectedQuestions([...effectiveSelectedQuestions, ...nextQuestions]);
    setSelectedBankQuestionIds([]);
  };

  const removeQuestion = (id: string) => {
    setSelectedQuestions(
      effectiveSelectedQuestions.filter((question) => question.id !== id),
    );
  };

  const updatePoints = (id: string, nextPoints: number) => {
    setSelectedQuestions(
      effectiveSelectedQuestions.map((question) =>
        question.id === id
          ? { ...question, points: nextPoints >= 1 ? nextPoints : 1 }
          : question,
      ),
    );
  };

  const handleSaveQuiz = async () => {
    if (!canSave) {
      toast.error(t("messages.validation_failed"));
      return;
    }

    try {
      const savedQuiz = await saveQuizMutation.mutateAsync(
        toQuizPayload({
          lessonId: resolvedLessonId,
          title: resolvedTitle,
          description: resolvedDescription,
          timeLimit: resolvedTimeLimit,
          passingScore: resolvedPassingScore,
          maxAttempts: resolvedMaxAttempts,
        }),
      );

      const savedRemoteQuestions = buildRemoteQuestionDrafts(
        savedQuiz,
        questionLookup,
      );
      const desiredQuestions = activeQuiz
        ? effectiveSelectedQuestions
        : mergeRemoteAndLocalQuestions(
            savedRemoteQuestions,
            effectiveSelectedQuestions,
          );

      const currentQuestions = savedQuiz.questions
        .slice()
        .sort((left, right) => left.orderIndex - right.orderIndex);

      const currentQuestionMap = new Map(
        currentQuestions.map((question) => [question.questionId, question]),
      );
      const desiredQuestionMap = new Map(
        desiredQuestions.map((question, index) => [
          question.id,
          {
            questionId: question.id,
            points: question.points,
            orderIndex: index,
          },
        ]),
      );

      const questionsToRemove = currentQuestions.filter((question) => {
        const desiredQuestion = desiredQuestionMap.get(question.questionId);

        return (
          !desiredQuestion ||
          desiredQuestion.points !== question.points ||
          desiredQuestion.orderIndex !== question.orderIndex
        );
      });

      for (const question of questionsToRemove) {
        await removeQuestionMutation.mutateAsync({
          quizId: savedQuiz.id,
          questionId: question.questionId,
        });
      }

      for (const [index, question] of desiredQuestions.entries()) {
        const currentQuestion = currentQuestionMap.get(question.id);
        const needsSync =
          !currentQuestion ||
          currentQuestion.points !== question.points ||
          currentQuestion.orderIndex !== index;

        if (!needsSync) {
          continue;
        }

        await addQuestionMutation.mutateAsync({
          quizId: savedQuiz.id,
          questionId: question.id,
          points: question.points,
          orderIndex: index,
        });
      }

      const nextQuiz: InstructorQuiz = {
        ...savedQuiz,
        lessonId: resolvedLessonId,
        title: resolvedTitle.trim(),
        description: resolvedDescription.trim(),
        timeLimit: resolvedTimeLimit,
        passingScore: resolvedPassingScore,
        maxAttempts: resolvedMaxAttempts,
        questions: desiredQuestions.map((question, index) => ({
          questionId: question.id,
          points: question.points,
          orderIndex: index,
        })),
      };

      setPersistedQuiz(nextQuiz);
      setSelectedQuestions(desiredQuestions);
      toast.success(t("messages.save_success"));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, t("messages.save_failed")));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => window.history.back()} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("messages.back")}
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-brand-border bg-brand-card/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("settings_desc")}
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <Eye className="h-4 w-4 mr-2" />
              {t("preview")}
            </Button>
            <Button
              onClick={handleSaveQuiz}
              disabled={!canSave || isSaving}
              className="bg-brand-amber hover:bg-brand-amber2 text-black font-semibold"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {t("save_quiz")}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("lesson_id_label")}
            </p>
            <Input
              value={resolvedLessonId}
              onChange={(event) => setLessonId(event.target.value)}
              placeholder={t("missing_lesson_id")}
              className="mt-2 bg-brand-bg/60 border-brand-border"
            />
          </div>
          <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("course_scope_label")}
            </p>
            <Input
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              placeholder={t("messages.all_courses_scope")}
              className="mt-2 bg-brand-bg/60 border-brand-border"
            />
          </div>
          <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("messages.sync_status")}
            </p>
            <p className="mt-1 text-sm font-medium">
              {activeQuiz ? t("messages.synced") : t("messages.pending_sync")}
            </p>
          </div>
        </div>

        {quizId && isLoadingQuizDetail && (
          <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3 text-sm text-muted-foreground">
            {t("messages.detail_loading")}
          </div>
        )}

        {quizId && isQuizDetailError && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
            <p>{t("messages.detail_load_failed")}</p>
          </div>
        )}

        {!resolvedLessonId && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
            <p>{t("messages.lesson_required")}</p>
          </div>
        )}

        {lessonContext && lessonContext.type !== "quiz" && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
            <p>
              {t("messages.lesson_type_warning", { type: lessonContext.type })}
            </p>
          </div>
        )}

        {!activeQuiz && resolvedLessonId && !quizId && (
          <div className="rounded-lg border border-brand-border bg-brand-bg/40 p-3 text-sm text-muted-foreground">
            {t("messages.first_sync_notice")}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="flex w-fit sm:w-full lg:w-[450px] bg-brand-card/50 border border-brand-border">
            <TabsTrigger
              value="settings"
              className="flex-1 flex items-center gap-2 whitespace-nowrap px-4 py-2"
            >
              <Settings className="h-4 w-4" />
              <span>{t("settings")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="flex-1 flex items-center gap-2 whitespace-nowrap px-4 py-2"
            >
              <ListChecks className="h-4 w-4" />
              <span>{t("select_questions")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="flex-1 flex items-center gap-2 whitespace-nowrap px-4 py-2"
            >
              <Layout className="h-4 w-4" />
              <span>{t("review")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="settings" className="outline-none">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-brand-border bg-brand-card/50">
              <CardHeader>
                <CardTitle className="text-xl">{t("settings")}</CardTitle>
                <CardDescription>{t("settings_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quiz-title" className="text-sm font-medium">
                      {t("title_label")}
                    </Label>
                    <Input
                      id="quiz-title"
                      value={resolvedTitle}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder={t("title_placeholder")}
                      className="bg-brand-bg/50 border-brand-border"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="quiz-description" className="text-sm font-medium">
                      {t("description_label")}
                    </Label>
                    <Textarea
                      id="quiz-description"
                      value={resolvedDescription}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder={t("description_placeholder")}
                      className="min-h-28 bg-brand-bg/50 border-brand-border"
                    />
                  </div>
                </div>

                <Separator className="bg-brand-border" />

                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-amber">
                      <Clock className="h-4 w-4" />
                      <Label className="font-semibold">{t("time_limit")}</Label>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      value={resolvedTimeLimit}
                      onChange={(event) =>
                        setTimeLimit(Math.max(1, Number(event.target.value) || 1))
                      }
                      className="bg-brand-bg/50 border-brand-border"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-amber">
                      <Trophy className="h-4 w-4" />
                      <Label className="font-semibold">{t("passing_score")}</Label>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      value={resolvedPassingScore}
                      onChange={(event) =>
                        setPassingScore(Math.max(1, Number(event.target.value) || 1))
                      }
                      className="bg-brand-bg/50 border-brand-border"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-amber">
                      <Plus className="h-4 w-4" />
                      <Label className="font-semibold">{t("max_attempts")}</Label>
                    </div>
                    <Input
                      type="number"
                      min={1}
                      value={resolvedMaxAttempts}
                      onChange={(event) =>
                        setMaxAttempts(Math.max(1, Number(event.target.value) || 1))
                      }
                      className="bg-brand-bg/50 border-brand-border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="questions" className="outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-brand-border bg-brand-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{t("select_questions")}</CardTitle>
                  <CardDescription>
                    {t("selected_count", {
                      count: effectiveSelectedQuestions.length,
                    })}
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add_new")}
                </Button>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <Reorder.Group
                  axis="y"
                  values={effectiveSelectedQuestions}
                  onReorder={(questions) => setSelectedQuestions(questions)}
                  className="space-y-4"
                >
                  <AnimatePresence mode="popLayout">
                    {effectiveSelectedQuestions.map((question, index) => (
                      <Reorder.Item
                        key={question.id}
                        value={question}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-brand-border bg-brand-bg/50 group"
                      >
                        <div className="mt-1 cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] uppercase border-brand-border text-brand-amber"
                            >
                              {question.type}
                            </Badge>
                            <span className="text-xs sm:text-sm font-medium">
                              {t("messages.question_index", { index: index + 1 })}
                            </span>
                          </div>
                          <p className="text-sm font-medium leading-relaxed">
                            {question.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {question.content}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                          <div className="text-right">
                            <Label className="text-[10px] text-muted-foreground uppercase">
                              {t("messages.points_label")}
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              className="h-8 w-16 text-center bg-brand-bg border-brand-border"
                              value={question.points}
                              onChange={(event) =>
                                updatePoints(
                                  question.id,
                                  Math.max(1, Number(event.target.value) || 1),
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>

                {effectiveSelectedQuestions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 border-2 border-dashed border-brand-border rounded-xl"
                  >
                    <p className="text-muted-foreground">
                      {t("messages.no_selected_questions")}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="h-fit border-brand-border bg-brand-card/50">
              <CardHeader>
                <CardTitle className="text-lg">{t("from_bank")}</CardTitle>
                <CardDescription>{t("bank_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder={t("search_bank")}
                    className="pl-8 h-9 text-sm bg-brand-bg/50 border-brand-border"
                  />
                </div>

                <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingQuestionBank &&
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-brand-border p-3"
                      >
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="mt-2 h-3 w-full" />
                      </div>
                    ))}

                  {!isLoadingQuestionBank && isQuestionBankError && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      {t("messages.bank_load_failed")}
                    </div>
                  )}

                  {!isLoadingQuestionBank &&
                    !isQuestionBankError &&
                    filteredQuestionBank.map((question) => {
                      const isChecked = selectedBankQuestionIds.includes(
                        question.id,
                      );
                      const isAlreadyAdded = effectiveSelectedQuestions.some(
                        (selectedQuestion) => selectedQuestion.id === question.id,
                      );

                      return (
                        <div
                          key={question.id}
                          className="p-3 rounded-md border border-brand-border text-xs flex items-start gap-3 hover:bg-brand-amber/5 transition-colors"
                        >
                          <Checkbox
                            id={`q-bank-${question.id}`}
                            checked={isChecked || isAlreadyAdded}
                            disabled={isAlreadyAdded}
                            onCheckedChange={(checked) =>
                              toggleQuestionSelection(
                                question.id,
                                Boolean(checked),
                              )
                            }
                            className="mt-1 border-brand-border data-[state=checked]:bg-brand-amber data-[state=checked]:text-black"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium line-clamp-1">
                                {question.title}
                              </p>
                              {isAlreadyAdded && (
                                <Badge
                                  variant="outline"
                                  className="border-brand-border text-[10px]"
                                >
                                  {t("messages.already_added")}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-1 line-clamp-2">
                              {question.content}
                            </p>
                            <p className="text-muted-foreground mt-1 uppercase text-[9px]">
                              {question.type}
                              {question.difficulty
                                ? ` • ${question.difficulty}`
                                : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  {!isLoadingQuestionBank &&
                    !isQuestionBankError &&
                    filteredQuestionBank.length === 0 && (
                      <div className="rounded-md border border-brand-border p-4 text-sm text-muted-foreground">
                        {t("messages.no_bank_results")}
                      </div>
                    )}
                </div>

                <Button
                  className="w-full bg-brand-amber hover:bg-brand-amber2 text-black font-semibold"
                  size="sm"
                  onClick={addSelectedQuestions}
                  disabled={selectedBankQuestionIds.length === 0}
                >
                  {t("add_selected")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="review" className="outline-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-brand-border bg-brand-card/50">
              <CardHeader>
                <CardTitle className="text-xl">{t("overview")}</CardTitle>
                <CardDescription>{t("overview_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">
                      {effectiveSelectedQuestions.length}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {t("messages.questions_stat")}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">
                      {totalPoints}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {t("messages.total_points")}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">
                      {resolvedTimeLimit}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {t("stat_minutes")}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/20 space-y-1">
                    <p className="text-2xl font-bold text-brand-amber">
                      {resolvedPassingScore}%
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {t("stat_pass_score")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {t("validation_summary")}
                  </h3>
                  <ul className="space-y-3">
                    {validationItems.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                            item.valid ? "bg-emerald-500/20" : "bg-amber-500/20"
                          }`}
                        >
                          {item.valid ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-brand-amber/5 border border-brand-amber/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="font-bold">{t("ready_title")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("ready_desc")}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleSaveQuiz}
                    disabled={!canSave || isSaving}
                    className="w-full sm:w-auto bg-brand-amber hover:bg-brand-amber2 text-black font-bold px-12"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {t("save_quiz")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorQuizCreatorView;
