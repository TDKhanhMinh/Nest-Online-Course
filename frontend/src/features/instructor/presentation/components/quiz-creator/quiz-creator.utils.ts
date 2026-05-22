import type { InstructorQuiz } from "../../../application/instructor-quiz.mapper";
import { QuestionType } from "../../../infrastructure/instructor-question.api";
import type {
  QuestionBankApiNode,
  QuestionBankItem,
  QuizQuestionDraft,
} from "./quiz-creator.types";

const defaultQuestionType = QuestionType.SINGLE_CHOICE;

const getUniqueIdValue = (id?: QuestionBankApiNode["_id"]) => {
  if (!id) return "";
  return typeof id === "string" ? id : id.value;
};

export const normalizeQuestionBankItem = (
  question: QuestionBankApiNode,
): QuestionBankItem => ({
  id: getUniqueIdValue(question?._id),
  title: question?.props?.title || "",
  content: question?.props?.content || "",
  type: question?.props?.type || defaultQuestionType,
  difficulty: question?.props?.difficulty,
  tags: question?.props?.tags || [],
});

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const createDraftQuestion = (
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

export const questionMatchesSearch = (
  question: QuestionBankItem,
  keyword: string,
) => {
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

export const buildRemoteQuestionDrafts = (
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

export const mergeRemoteAndLocalQuestions = (
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

export const resolveStringValue = (draftValue: string | null, fallbackValue?: string) => {
  if (draftValue !== null) {
    return draftValue;
  }

  return fallbackValue ?? "";
};

export const resolveNumberValue = (
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

export const toCreateQuizPayload = ({
  lessonId,
  title,
  description,
  timeLimit,
  passingScore,
  maxAttempts,
}: {
  lessonId: string | null;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
}) => ({
  lessonId: lessonId && lessonId.trim().length > 0 ? lessonId.trim() : null,
  title: title.trim(),
  description: description.trim(),
  timeLimit,
  passingScore,
  maxAttempts,
});

export const toUpdateQuizPayload = ({
  title,
  description,
  timeLimit,
  passingScore,
  maxAttempts,
}: {
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
}) => ({
  title: title.trim(),
  description: description.trim(),
  timeLimit,
  passingScore,
  maxAttempts,
});
