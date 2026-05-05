import { AggregateRoot } from '@/common/abstractions/aggregate-root.base';
import { UniqueId } from '@/common/types/unique-id.vo';
import { EnrollmentStatus } from '@/api/enrollment/value-objects/enrollment-status.vo';

export interface EnrollmentProps {
  studentId: UniqueId;
  courseId: UniqueId;
  status: EnrollmentStatus;
  enrolledAt: Date;
  completedLectureIds: UniqueId[];
}

export class Enrollment extends AggregateRoot<EnrollmentProps> {
  get studentId(): UniqueId       { return this.props.studentId; }
  get courseId(): UniqueId        { return this.props.courseId; }
  get status(): EnrollmentStatus  { return this.props.status; }
  get enrolledAt(): Date          { return this.props.enrolledAt; }
  get completedLectureIds(): UniqueId[] { return this.props.completedLectureIds; }

  isActive(): boolean { return this.props.status.isActive(); }

  markLectureAsComplete(lectureId: UniqueId): void {
    if (!this.props.completedLectureIds.some(id => id.equals(lectureId))) {
      this.props.completedLectureIds.push(lectureId);
    }
  }

  complete(): void {
    this.props.status = EnrollmentStatus.completed();
  }

  cancel(): void {
    this.props.status = EnrollmentStatus.cancelled();
  }

  static create(studentId: UniqueId, courseId: UniqueId, id?: UniqueId): Enrollment {
    return new Enrollment(
      { 
        studentId, 
        courseId, 
        status: EnrollmentStatus.active(), 
        enrolledAt: new Date(),
        completedLectureIds: []
      },
      id ?? UniqueId.generate(),
    );
  }

  static reconstitute(props: EnrollmentProps, id: UniqueId): Enrollment {
    return new Enrollment(props, id);
  }
}
