import type {
  InstructorQuizDTO,
  QuizQuestionDTO,
} from "../infrastructure/instructor-quiz.api";

export interface InstructorQuizQuestion {
  questionId: string;
  points: number;
  orderIndex: number;
}

export interface InstructorQuiz {
  id: string;
  lessonId: string | null;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  maxAttempts: number;
  questions: InstructorQuizQuestion[];
}

const mapQuestion = (question: QuizQuestionDTO): InstructorQuizQuestion => ({
  questionId: question.questionId,
  points: question.points ?? 0,
  orderIndex: question.orderIndex ?? 0,
});

export const mapInstructorQuiz = (quiz: InstructorQuizDTO): InstructorQuiz => ({
  id: quiz.id,
  lessonId: quiz.lessonId ?? null,
  title: quiz.title,
  description: quiz.description ?? "",
  passingScore: quiz.passingScore ?? 0,
  timeLimit: quiz.timeLimit ?? 0,
  maxAttempts: quiz.maxAttempts ?? 0,
  questions: (quiz.questions ?? [])
    .map(mapQuestion)
    .sort((left, right) => left.orderIndex - right.orderIndex),
});
