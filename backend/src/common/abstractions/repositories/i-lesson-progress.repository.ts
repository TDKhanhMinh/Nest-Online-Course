import { LessonProgress } from '@/api/enrollment/entities/lesson-progress.entity';

export const ILESSON_PROGRESS_REPOSITORY = 'ILESSON_PROGRESS_REPOSITORY';

export interface ILessonProgressRepository {
  findByEnrollmentId(enrollmentId: string): Promise<LessonProgress[]>;
  findOne(enrollmentId: string, lessonId: string): Promise<LessonProgress | null>;
  save(progress: LessonProgress): Promise<void>;
}
