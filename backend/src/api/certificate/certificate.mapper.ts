import { Injectable } from '@nestjs/common';
import { Certificate } from '@/api/certificate/entities/certificate.entity';
import { CertificateDocument } from '@/database/schemas/certificate.schema';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class CertificateMapper {
  toDomain(doc: CertificateDocument): Certificate {
    return Certificate.reconstitute(
      {
        studentId: new UniqueId(doc.studentId),
        courseId: new UniqueId(doc.courseId),
        certificateNumber: doc.certificateNumber,
        certificateUrl: doc.certificateUrl,
        issuedAt: doc.issuedAt,
      },
      new UniqueId((doc._id as any).toString()),
    );
  }

  toPersistence(domain: Certificate): any {
    return {
      _id: domain.id.value as any,
      studentId: domain.studentId.value,
      courseId: domain.courseId.value,
      certificateNumber: domain.certificateNumber,
      certificateUrl: domain.certificateUrl,
      issuedAt: domain.issuedAt,
    };
  }
}
