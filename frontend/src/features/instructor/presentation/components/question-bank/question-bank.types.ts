import type {
  DifficultyLevel,
  QuestionDTO,
  QuestionOptionDTO,
  QuestionType,
} from "../../../infrastructure/instructor-question.api";

export type QuestionBankQuestionNode = QuestionDTO;

export interface QuestionBankFormState {
  title: string;
  content: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  tags: string;
  options: QuestionOptionDTO[];
}
