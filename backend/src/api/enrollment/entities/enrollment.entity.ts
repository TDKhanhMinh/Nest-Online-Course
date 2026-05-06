import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { EnrollmentStatus } from '@/api/enrollment/value-objects/enrollment-status.vo';

export interface EnrollmentProps {
  studentId: UniqueId;
  courseId: UniqueId;
  status: EnrollmentStatus;
  enrolledAt: Date;
  progress: number;
}

export class Enrollment extends AggregateRoot<EnrollmentProps> {
  get studentId(): UniqueId {
    return this.props.studentId;
  }
  get courseId(): UniqueId {
    return this.props.courseId;
  }
  get status(): EnrollmentStatus {
    return this.props.status;
  }
  get enrolledAt(): Date {
    return this.props.enrolledAt;
  }
  get progress(): number {
    return this.props.progress;
  }

  isActive(): boolean {
    return this.props.status.isActive();
  }

  updateProgress(progress: number): void {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    this.props.progress = progress;
    if (progress === 100) {
      this.complete();
    }
  }

  complete(): void {
    this.props.status = EnrollmentStatus.completed();
  }

  cancel(): void {
    this.props.status = EnrollmentStatus.cancelled();
  }

  static create(
    studentId: UniqueId,
    courseId: UniqueId,
    id?: UniqueId,
  ): Enrollment {
    return new Enrollment(
      {
        studentId,
        courseId,
        status: EnrollmentStatus.active(),
        enrolledAt: new Date(),
        progress: 0,
      },
      id ?? UniqueId.generate(),
    );
  }

  static reconstitute(props: EnrollmentProps, id: UniqueId): Enrollment {
    return new Enrollment(props, id);
  }
}
