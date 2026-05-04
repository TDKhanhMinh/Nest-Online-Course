import { Enrollment } from '@/api/enrollment/entities/enrollment.entity';
import { UniqueId } from '@/common/types/unique-id.vo';

export interface IEnrollmentRepository {
  findById(id: UniqueId): Promise<Enrollment | null>;
  findByStudentAndCourse(studentId: UniqueId, courseId: UniqueId): Promise<Enrollment | null>;
  findAllByStudent(studentId: UniqueId): Promise<Enrollment[]>;
  save(enrollment: Enrollment): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}

export const ENROLLMENT_REPOSITORY = Symbol('IEnrollmentRepository');
