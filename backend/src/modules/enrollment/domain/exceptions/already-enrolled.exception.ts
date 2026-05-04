import { DomainException } from '@/infrastructure/shared-kernel/domain-exception.base';

export class AlreadyEnrolledException extends DomainException {
  readonly code = 'ALREADY_ENROLLED';

  constructor(studentId: string, courseId: string) {
    super(`Student "${studentId}" is already enrolled in course "${courseId}"`);
  }
}
