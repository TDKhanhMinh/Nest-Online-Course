import { Certificate } from '@domain/certificate/entities/certificate.entity';
import { CertificateDocument } from '@/database/schemas/certificate.schema';
import { UniqueId } from '@shared/types/unique-id.vo';

export class CertificateMapper {
  static toDomain(doc: CertificateDocument): Certificate {
    return Certificate.reconstitute(
      {
        studentId: new UniqueId(doc.studentId.toString()),
        courseId: new UniqueId(doc.courseId.toString()),
        certificateNumber: doc.certificateNumber,
        certificateUrl: doc.certificateUrl,
        issuedAt: doc.issuedAt,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  static toPersistence(domain: Certificate): any {
    return {
      _id: domain.id.value,
      studentId: domain.studentId.value,
      courseId: domain.courseId.value,
      certificateNumber: domain.certificateNumber,
      certificateUrl: domain.certificateUrl,
      issuedAt: domain.issuedAt,
    };
  }
}
