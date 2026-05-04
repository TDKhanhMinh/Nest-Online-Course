import { EnrollmentStatusValue } from '../../domain/value-objects/enrollment-status.vo';

export interface EnrollStudentResult {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatusValue;
  enrolledAt: Date;
}
