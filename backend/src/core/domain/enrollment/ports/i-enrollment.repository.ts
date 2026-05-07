import { Enrollment } from '@domain/enrollment/entities/enrollment.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface IEnrollmentRepository {
  findById(id: UniqueId): Promise<Enrollment | null>;
  findByStudentAndCourse(studentId: UniqueId, courseId: UniqueId): Promise<Enrollment | null>;
  findAllByStudent(studentId: UniqueId): Promise<Enrollment[]>;
  save(enrollment: Enrollment): Promise<void>;
  delete(id: UniqueId): Promise<void>;
}

export const IENROLLMENT_REPOSITORY = Symbol('IEnrollmentRepository');



