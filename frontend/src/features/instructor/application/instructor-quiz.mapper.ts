import type {
  ListedQuizDTO,
  RawQuizDTO,
  RawQuizQuestionDTO,
  UniqueIdDTO,
} from "../infrastructure/instructor-quiz.api";

export interface InstructorQuizQuestion {
  questionId: string;
  points: number;
  orderIndex: number;
}

export interface InstructorQuiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
  questions: InstructorQuizQuestion[];
}

const unwrapId = (value?: UniqueIdDTO | string | null): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.value ?? "";
};

const mapQuestion = (question: RawQuizQuestionDTO): InstructorQuizQuestion => ({
  questionId: unwrapId(question.questionId),
  points: question.points ?? 0,
  orderIndex: question.orderIndex ?? 0,
});

export const mapInstructorQuiz = (quiz: RawQuizDTO): InstructorQuiz => ({
  id: unwrapId(quiz._id) || quiz.id || "",
  lessonId: unwrapId(quiz.props?.lessonId),
  title: quiz.props?.title ?? "",
  description: quiz.props?.description ?? "",
  passingScore: quiz.props?.passingScore ?? 0,
  timeLimit: quiz.props?.timeLimit ?? 0,
  maxAttempts: quiz.props?.maxAttempts ?? 0,
  questions: (quiz.props?.questions ?? [])
    .map(mapQuestion)
    .sort((left, right) => left.orderIndex - right.orderIndex),
});

export const mapListedInstructorQuiz = (
  quiz: ListedQuizDTO
): InstructorQuiz => ({
  id: quiz.id,
  lessonId: quiz.lessonId,
  title: quiz.title,
  description: quiz.description ?? "",
  passingScore: quiz.passingScore ?? 0,
  timeLimit: quiz.timeLimit ?? 0,
  maxAttempts: quiz.maxAttempts ?? 0,
  questions: (quiz.questions ?? [])
    .map((question) => ({
      questionId: question.questionId,
      points: question.points ?? 0,
      orderIndex: question.orderIndex ?? 0,
    }))
    .sort((left, right) => left.orderIndex - right.orderIndex),
});
