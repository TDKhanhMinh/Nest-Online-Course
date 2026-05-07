import { Enrollment } from '@domain/enrollment/entities/enrollment.entity';
import { EnrollmentDocument } from '@/database/schemas/enrollment.schema';
import { UniqueId } from '@shared/types/unique-id.vo';
import { EnrollmentStatus } from '@domain/enrollment/value-objects/enrollment-status.vo';

export class EnrollmentMapper {
  static toDomain(doc: EnrollmentDocument): Enrollment {
    return Enrollment.reconstitute(
      {
        studentId: new UniqueId(doc.studentId.toString()),
        courseId: new UniqueId(doc.courseId.toString()),
        enrolledAt: doc.enrolledAt,
        completedAt: doc.completedAt,
        status: EnrollmentStatus.create(doc.status),
        progress: doc.progress,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Enrollment): any {
    return {
      _id: domain.id.value,
      studentId: domain.studentId.value,
      courseId: domain.courseId.value,
      enrolledAt: domain.enrolledAt,
      completedAt: domain.completedAt,
      status: domain.status.value,
      progress: domain.progress,
    };
  }
}
