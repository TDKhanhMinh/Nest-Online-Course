import { Injectable } from '@nestjs/common';
import { Enrollment } from '@/api/enrollment/entities/enrollment.entity';
import { EnrollmentDocument } from '@/database/schemas/enrollment.schema';
import { UniqueId } from '@/common/types/unique-id.vo';
import { EnrollmentStatus, EnrollmentStatusValue } from '@/api/enrollment/value-objects/enrollment-status.vo';

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
      new UniqueId((doc._id as any).toString()),
    );
  }

  toPersistence(domain: Enrollment): any {
    return {
      _id:        domain.id.value as any,
      studentId:  domain.studentId.value,
      courseId:   domain.courseId.value,
      status:     domain.status.value,
      enrolledAt: domain.enrolledAt,
    };
  }
}
