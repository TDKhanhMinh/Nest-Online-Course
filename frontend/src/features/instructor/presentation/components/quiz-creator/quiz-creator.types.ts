import type { InstructorQuiz } from "../../../application/instructor-quiz.mapper";
import type {
  DifficultyLevel,
  QuestionDTO,
  QuestionType,
} from "../../../infrastructure/instructor-question.api";

export interface QuizQuestionDraft {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty?: DifficultyLevel;
  points: number;
}

export interface QuestionBankItem {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty?: DifficultyLevel;
  tags: string[];
}

export type QuestionBankApiNode = QuestionDTO;

export interface QuizValidationItem {
  label: string;
  valid: boolean;
}

export type InstructorQuizDetail = InstructorQuiz;
