import { Inject, Injectable } from '@nestjs/common';
import { 
  ICERTIFICATE_REPOSITORY, 
  ICertificateRepository 
} from '@domain/certificate/ports/i-certificate.repository';
import { UniqueId } from '@shared/types/unique-id.vo';
import { CertificateResponseDto } from '../dto/certificate.dto';

@Injectable()
export class GetStudentCertificatesUseCase {
  constructor(
    @Inject(ICERTIFICATE_REPOSITORY)
    private readonly certRepo: ICertificateRepository,
  ) {}

  async execute(studentId: string): Promise<CertificateResponseDto[]> {
    const certificates = await this.certRepo.findAllByStudent(new UniqueId(studentId));

    return certificates.map(cert => ({
      id: cert.id.value,
      studentId: cert.studentId.value,
      courseId: cert.courseId.value,
      certificateNumber: cert.certificateNumber,
      certificateUrl: cert.certificateUrl,
      issuedAt: cert.issuedAt,
    }));
  }
}
