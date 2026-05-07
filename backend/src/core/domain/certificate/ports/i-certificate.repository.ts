import { Certificate } from '@domain/certificate/entities/certificate.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface ICertificateRepository {
  findById(id: UniqueId): Promise<Certificate | null>;
  findByStudentAndCourse(studentId: UniqueId, courseId: UniqueId): Promise<Certificate | null>;
  findAllByStudent(studentId: UniqueId): Promise<Certificate[]>;
  save(certificate: Certificate): Promise<void>;
}

export const ICERTIFICATE_REPOSITORY = Symbol('ICertificateRepository');



