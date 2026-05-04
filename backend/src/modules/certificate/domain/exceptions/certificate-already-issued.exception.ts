import { DomainException } from '@/infrastructure/shared-kernel/domain-exception.base';

export class CertificateAlreadyIssuedException extends DomainException {
  readonly code = 'CERTIFICATE_ALREADY_ISSUED';

  constructor(studentId: string, courseId: string) {
    super(`Certificate for student "${studentId}" and course "${courseId}" already exists`);
  }
}
