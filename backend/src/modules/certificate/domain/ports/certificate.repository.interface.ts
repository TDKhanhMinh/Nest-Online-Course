import { Certificate } from '../entities/certificate.entity';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';

export interface ICertificateRepository {
  findById(id: UniqueId): Promise<Certificate | null>;
  findByStudentAndCourse(studentId: UniqueId, courseId: UniqueId): Promise<Certificate | null>;
  findAllByStudent(studentId: UniqueId): Promise<Certificate[]>;
  save(certificate: Certificate): Promise<void>;
}

export const CERTIFICATE_REPOSITORY = Symbol('ICertificateRepository');
