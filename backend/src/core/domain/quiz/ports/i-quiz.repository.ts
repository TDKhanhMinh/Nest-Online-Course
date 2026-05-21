import { Quiz } from '../entities/quiz.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';

export const QUIZ_REPOSITORY = Symbol('IQuizRepository');

export interface IQuizRepository {
  save(quiz: Quiz): Promise<void>;
  findById(id: UniqueId): Promise<Quiz | null>;
  findByLessonId(lessonId: UniqueId): Promise<Quiz | null>;
  findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Quiz>>;
  delete(id: UniqueId): Promise<void>;
}
