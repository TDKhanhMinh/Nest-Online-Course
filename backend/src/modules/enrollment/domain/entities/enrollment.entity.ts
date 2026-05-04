import { AggregateRoot } from '@/infrastructure/shared-kernel/aggregate-root.base';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { EnrollmentStatus } from '../value-objects/enrollment-status.vo';

export interface EnrollmentProps {
  studentId: UniqueId;
  courseId: UniqueId;
  status: EnrollmentStatus;
  enrolledAt: Date;
}

export class Enrollment extends AggregateRoot<EnrollmentProps> {
  get studentId(): UniqueId       { return this.props.studentId; }
  get courseId(): UniqueId        { return this.props.courseId; }
  get status(): EnrollmentStatus  { return this.props.status; }
  get enrolledAt(): Date          { return this.props.enrolledAt; }

  isActive(): boolean { return this.props.status.isActive(); }

  complete(): void {
    this.props.status = EnrollmentStatus.completed();
  }

  cancel(): void {
    this.props.status = EnrollmentStatus.cancelled();
  }

  static create(studentId: UniqueId, courseId: UniqueId, id?: UniqueId): Enrollment {
    return new Enrollment(
      { studentId, courseId, status: EnrollmentStatus.active(), enrolledAt: new Date() },
      id ?? UniqueId.generate(),
    );
  }

  static reconstitute(props: EnrollmentProps, id: UniqueId): Enrollment {
    return new Enrollment(props, id);
  }
}
