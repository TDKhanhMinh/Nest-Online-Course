import { LessonProgress } from '@domain/enrollment/entities/lesson-progress.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const ILESSON_PROGRESS_REPOSITORY = Symbol('ILessonProgressRepository');

export interface ILessonProgressRepository {
  findByEnrollmentId(enrollmentId: UniqueId): Promise<LessonProgress[]>;
  findOne(enrollmentId: UniqueId, lessonId: UniqueId): Promise<LessonProgress | null>;
  save(progress: LessonProgress): Promise<void>;
}



