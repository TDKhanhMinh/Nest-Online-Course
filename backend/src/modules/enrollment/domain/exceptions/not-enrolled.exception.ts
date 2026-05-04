import { DomainException } from '@/infrastructure/shared-kernel/domain-exception.base';

export class NotEnrolledException extends DomainException {
  readonly code = 'NOT_ENROLLED';

  constructor(studentId: string, courseId: string) {
    super(`Student "${studentId}" is not enrolled in course "${courseId}"`);
  }
}
