import { Lesson } from '@domain/course/entities/lesson.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const ILESSON_REPOSITORY = Symbol('ILessonRepository');

export interface ILessonRepository {
  findById(id: UniqueId): Promise<Lesson | null>;
  findBySectionId(sectionId: UniqueId): Promise<Lesson[]>;
  save(lesson: Lesson): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}



