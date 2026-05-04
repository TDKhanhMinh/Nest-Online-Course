import { DomainException } from '@/infrastructure/shared-kernel/domain-exception.base';

export class LessonAlreadyCompletedException extends DomainException {
  readonly code = 'LESSON_ALREADY_COMPLETED';

  constructor(lessonId: string) {
    super(`Lesson "${lessonId}" has already been completed`);
  }
}
