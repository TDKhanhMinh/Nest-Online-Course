import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { 
  ICertificateRepository, 
  ICERTIFICATE_REPOSITORY 
} from '@domain/certificate/ports/i-certificate.repository';
import { 
  IFileStorageService, 
  IFILE_STORAGE_SERVICE 
} from '@shared/abstractions/services/i-file-storage.service';
import { Certificate } from '@domain/certificate/entities/certificate.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import { randomUUID } from 'crypto';
import { IssueCertificateDto, CertificateResponseDto } from '../dto/certificate.dto';

@Injectable()
export class IssueCertificateUseCase {
  constructor(
    @Inject(ICERTIFICATE_REPOSITORY)
    private readonly certRepo: ICertificateRepository,

    @Inject(IFILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: IssueCertificateDto): Promise<CertificateResponseDto> {
    const studentId = new UniqueId(dto.studentId);
    const courseId = new UniqueId(dto.courseId);

    // 1. Check if already issued
    const existing = await this.certRepo.findByStudentAndCourse(
      studentId,
      courseId,
    );
    if (existing) {
      throw new DomainException(
        ErrorCode.CERTIFICATE_ALREADY_ISSUED,
        `Certificate already issued for student "${dto.studentId}" and course "${dto.courseId}"`,
      );
    }

    // 2. Generate certificate number
    const certNumber = `CERT-${Date.now()}-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;

    // 3. Generate PDF (Placeholder logic - in real world this would use a PDF lib)
    const pdfBuffer = Buffer.from(`Certificate of Completion for Course ID ${dto.courseId}\nCertificate Number: ${certNumber}`);
    
    // 4. Upload to storage
    const certUrl = await this.fileStorage.uploadFile(
      pdfBuffer,
      `certificates/${certNumber}.pdf`,
      'application/pdf',
    );

    // 5. Create domain entity
    const certificate = Certificate.issue(
      studentId,
      courseId,
      certNumber,
      certUrl,
    );

    // 6. Save to repository
    await this.certRepo.save(certificate);

    // 7. Dispatch domain events
    for (const event of certificate.domainEvents) {
      await this.eventEmitter.emitAsync(event.constructor.name, event);
    }
    certificate.clearDomainEvents();

    return {
      id: certificate.id.value,
      studentId: certificate.studentId.value,
      courseId: certificate.courseId.value,
      certificateNumber: certificate.certificateNumber,
      certificateUrl: certificate.certificateUrl,
      issuedAt: certificate.issuedAt,
    };
  }
}
