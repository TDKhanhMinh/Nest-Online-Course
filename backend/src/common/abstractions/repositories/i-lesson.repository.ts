import { Lesson } from '@/api/course/entities/lesson.entity';

export const ILessonRepository = Symbol('ILessonRepository');

export interface ILessonRepository {
  findById(id: string): Promise<Lesson | null>;
  findBySectionId(sectionId: string): Promise<Lesson[]>;
  save(lesson: Lesson): Promise<void>;
  delete(id: string): Promise<void>;
}
