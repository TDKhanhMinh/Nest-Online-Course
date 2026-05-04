import { DomainException } from '@/infrastructure/shared-kernel/domain-exception.base';

export class CourseNotFoundException extends DomainException {
  readonly code = 'COURSE_NOT_FOUND';

  constructor(courseId: string) {
    super(`Course with id "${courseId}" was not found`);
  }
}
