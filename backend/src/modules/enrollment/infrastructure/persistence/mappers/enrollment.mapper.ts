import { Injectable } from '@nestjs/common';
import { Enrollment } from '../../../domain/entities/enrollment.entity';
import { EnrollmentDocument } from '../schemas/enrollment.schema';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { EnrollmentStatus, EnrollmentStatusValue } from '../../../domain/value-objects/enrollment-status.vo';

@Injectable()
export class EnrollmentMapper {
  toDomain(doc: EnrollmentDocument): Enrollment {
    return Enrollment.reconstitute(
      {
        studentId:  new UniqueId(doc.studentId),
        courseId:   new UniqueId(doc.courseId),
        status:     new EnrollmentStatus(doc.status as EnrollmentStatusValue),
        enrolledAt: doc.enrolledAt,
      },
      new UniqueId(doc._id),
    );
  }

  toPersistence(domain: Enrollment): Partial<EnrollmentDocument> {
    return {
      _id:        domain.id.value,
      studentId:  domain.studentId.value,
      courseId:   domain.courseId.value,
      status:     domain.status.value,
      enrolledAt: domain.enrolledAt,
    };
  }
}
