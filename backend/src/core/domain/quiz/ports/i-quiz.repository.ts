import { Quiz } from '../entities/quiz.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const QUIZ_REPOSITORY = Symbol('IQuizRepository');

export interface IQuizRepository {
  save(quiz: Quiz): Promise<void>;
  findById(id: UniqueId): Promise<Quiz | null>;
  findByLessonId(lessonId: UniqueId): Promise<Quiz | null>;
  delete(id: UniqueId): Promise<void>;
}
