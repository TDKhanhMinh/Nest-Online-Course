"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Layout, ListChecks, Settings } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseCurriculum } from "@/features/course/presentation/hooks/use-course-curriculum";

import type { InstructorQuiz } from "../../application/instructor-quiz.mapper";
import { useInstructorQuestions } from "../hooks/use-instructor-questions";
import {
  useAddQuestionToInstructorQuiz,
  useCreateInstructorQuiz,
  useInstructorQuizDetail,
  useRemoveQuestionFromInstructorQuiz,
  useUpdateInstructorQuiz,
} from "../hooks/use-instructor-quizzes";
import { QuizCreatorContextPanel } from "./quiz-creator/quiz-creator-context-panel";
import { QuizCreatorHeader } from "./quiz-creator/quiz-creator-header";
import { QuizCreatorQuestionsTab } from "./quiz-creator/quiz-creator-questions-tab";
import { QuizCreatorReviewTab } from "./quiz-creator/quiz-creator-review-tab";
import { QuizCreatorSettingsTab } from "./quiz-creator/quiz-creator-settings-tab";
import type {
  QuizQuestionDraft,
  QuizValidationItem,
} from "./quiz-creator/quiz-creator.types";
import {
  buildRemoteQuestionDrafts,
  createDraftQuestion,
  getErrorMessage,
  mergeRemoteAndLocalQuestions,
  normalizeQuestionBankItem,
  questionMatchesSearch,
  resolveNumberValue,
  resolveStringValue,
  toCreateQuizPayload,
  toUpdateQuizPayload,
} from "./quiz-creator/quiz-creator.utils";

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

  const createQuizMutation = useCreateInstructorQuiz();
  const updateQuizMutation = useUpdateInstructorQuiz();
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
  const resolvedLessonId =
    lessonId !== null ? lessonId : activeQuiz?.lessonId ?? null;
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

  const validationItems: QuizValidationItem[] = [
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
      valid:
        resolvedLessonId === null || resolvedLessonId.trim().length > 0,
    },
  ];

  const canSave =
    resolvedTitle.trim().length > 0 &&
    resolvedTimeLimit >= 1 &&
    resolvedPassingScore >= 1 &&
    resolvedMaxAttempts >= 1 &&
    !isLoadingQuizDetail;

  const isSaving =
    createQuizMutation.isPending ||
    updateQuizMutation.isPending ||
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
      .filter((question): question is NonNullable<typeof question> =>
        Boolean(question),
      )
      .filter((question) => !existingIds.has(question.id))
      .map((question) => createDraftQuestion(question, 1));

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
      const currentQuizId = activeQuiz?.id || quizId;
      const savedQuiz = currentQuizId
        ? await updateQuizMutation.mutateAsync({
            quizId: currentQuizId,
            data: toUpdateQuizPayload({
              title: resolvedTitle,
              description: resolvedDescription,
              timeLimit: resolvedTimeLimit,
              passingScore: resolvedPassingScore,
              maxAttempts: resolvedMaxAttempts,
            }),
          })
        : await createQuizMutation.mutateAsync(
            toCreateQuizPayload({
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
        lessonId: savedQuiz.lessonId,
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
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <QuizCreatorHeader
        onBack={() => window.history.back()}
        onSave={handleSaveQuiz}
        canSave={canSave}
        isSaving={isSaving}
      >
        <QuizCreatorContextPanel
          courseId={courseId}
          hasActiveQuiz={Boolean(activeQuiz)}
          isLoadingQuizDetail={isLoadingQuizDetail}
          isQuizDetailError={isQuizDetailError}
          lessonContextType={lessonContext?.type}
          quizId={quizId}
          resolvedLessonId={resolvedLessonId ?? ""}
          setCourseId={setCourseId}
          setLessonId={(value) => setLessonId(value.trim().length > 0 ? value : null)}
        />
      </QuizCreatorHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <TabsList className="flex w-fit border border-brand-border bg-brand-card/50 sm:w-full lg:w-[450px]">
            <TabsTrigger
              value="settings"
              className="flex flex-1 items-center gap-2 whitespace-nowrap px-4 py-2"
            >
              <Settings className="h-4 w-4" />
              <span>{t("settings")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="flex flex-1 items-center gap-2 whitespace-nowrap px-4 py-2"
            >
              <ListChecks className="h-4 w-4" />
              <span>{t("select_questions")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="flex flex-1 items-center gap-2 whitespace-nowrap px-4 py-2"
            >
              <Layout className="h-4 w-4" />
              <span>{t("review")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="settings" className="outline-none">
          <QuizCreatorSettingsTab
            resolvedDescription={resolvedDescription}
            resolvedMaxAttempts={resolvedMaxAttempts}
            resolvedPassingScore={resolvedPassingScore}
            resolvedTimeLimit={resolvedTimeLimit}
            resolvedTitle={resolvedTitle}
            setDescription={setDescription}
            setMaxAttempts={setMaxAttempts}
            setPassingScore={setPassingScore}
            setTimeLimit={setTimeLimit}
            setTitle={setTitle}
          />
        </TabsContent>

        <TabsContent value="questions" className="outline-none">
          <QuizCreatorQuestionsTab
            addSelectedQuestions={addSelectedQuestions}
            effectiveSelectedQuestions={effectiveSelectedQuestions}
            filteredQuestionBank={filteredQuestionBank}
            isLoadingQuestionBank={isLoadingQuestionBank}
            isQuestionBankError={isQuestionBankError}
            removeQuestion={removeQuestion}
            searchKeyword={searchKeyword}
            selectedBankQuestionIds={selectedBankQuestionIds}
            setSearchKeyword={setSearchKeyword}
            setSelectedQuestions={(questions) =>
              setSelectedQuestions(questions)
            }
            toggleQuestionSelection={toggleQuestionSelection}
            updatePoints={updatePoints}
          />
        </TabsContent>

        <TabsContent value="review" className="outline-none">
          <QuizCreatorReviewTab
            canSave={canSave}
            handleSaveQuiz={handleSaveQuiz}
            isSaving={isSaving}
            questionCount={effectiveSelectedQuestions.length}
            resolvedPassingScore={resolvedPassingScore}
            resolvedTimeLimit={resolvedTimeLimit}
            totalPoints={totalPoints}
            validationItems={validationItems}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorQuizCreatorView;
