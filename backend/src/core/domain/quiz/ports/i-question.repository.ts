import { Question } from '../entities/question.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';

export const QUESTION_REPOSITORY = Symbol('IQuestionRepository');

export interface IQuestionRepository {
  save(question: Question): Promise<void>;
  findById(id: UniqueId): Promise<Question | null>;
  delete(id: UniqueId): Promise<void>;
  findInstructorQuestions(
    instructorId: UniqueId,
    pageOptionsDto: PageOptionsDto,
    courseId?: UniqueId
  ): Promise<PageDto<Question>>;
}
