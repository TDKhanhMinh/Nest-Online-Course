import { QuizAttempt } from '../entities/quiz-attempt.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';

export const QUIZ_ATTEMPT_REPOSITORY = Symbol('IQuizAttemptRepository');

export interface IQuizAttemptRepository {
  save(attempt: QuizAttempt): Promise<void>;
  findById(id: UniqueId): Promise<QuizAttempt | null>;
  findByStudentAndQuiz(
    studentId: UniqueId,
    quizId: UniqueId,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<QuizAttempt>>;
  countAttempts(studentId: UniqueId, quizId: UniqueId): Promise<number>;
}
