import { Injectable } from '@nestjs/common';
import { Certificate } from '../../../domain/entities/certificate.entity';
import { CertificateDocument } from '../schemas/certificate.schema';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';

@Injectable()
export class CertificateMapper {
  toDomain(doc: CertificateDocument): Certificate {
    return Certificate.reconstitute(
      {
        studentId:         new UniqueId(doc.studentId),
        courseId:          new UniqueId(doc.courseId),
        certificateNumber: doc.certificateNumber,
        certificateUrl:    doc.certificateUrl,
        issuedAt:          doc.issuedAt,
      },
      new UniqueId(doc._id),
    );
  }

  toPersistence(domain: Certificate): Partial<CertificateDocument> {
    return {
      _id:               domain.id.value,
      studentId:         domain.studentId.value,
      courseId:          domain.courseId.value,
      certificateNumber: domain.certificateNumber,
      certificateUrl:    domain.certificateUrl,
      issuedAt:          domain.issuedAt,
    };
  }
}
