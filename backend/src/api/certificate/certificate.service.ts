import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICertificateRepository, CERTIFICATE_REPOSITORY } from '@/common/abstractions/repositories/i-certificate.repository';
import { IFileStorageService, FILE_STORAGE_SERVICE } from '@/common/abstractions/services/i-file-storage.service';
import { Certificate } from '@/api/certificate/entities/certificate.entity';
import { UniqueId } from '@/common/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import { randomUUID } from 'crypto';

export class IssueCertificateCommand {
  studentId: string;
  courseId: string;
}

export class IssueCertificateResult {
  certificateId: string;
  certificateNumber: string;
  certificateUrl: string;
  issuedAt: Date;
}

@Injectable()
export class CertificateService {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certRepo: ICertificateRepository,

    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageService,

    private readonly eventEmitter: EventEmitter2,
  ) { }

  async issueCertificate(cmd: IssueCertificateCommand): Promise<IssueCertificateResult> {
    const studentId = new UniqueId(cmd.studentId);
    const courseId = new UniqueId(cmd.courseId);

    const existing = await this.certRepo.findByStudentAndCourse(studentId, courseId);
    if (existing) throw new DomainException(ErrorCode.CERTIFICATE_ALREADY_ISSUED, `Certificate already issued for student "${cmd.studentId}" and course "${cmd.courseId}"`);

    const certNumber = `CERT-${Date.now()}-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;

    const pdfBuffer = Buffer.from(`Certificate ${certNumber}`); // Placeholder
    const certUrl = await this.fileStorage.uploadFile(pdfBuffer, `${certNumber}.pdf`, 'application/pdf');

    const certificate = Certificate.issue(studentId, courseId, certNumber, certUrl);
    await this.certRepo.save(certificate);

    for (const event of certificate.domainEvents) {
      await this.eventEmitter.emitAsync(event.constructor.name, event);
    }
    certificate.clearDomainEvents();

    return {
      certificateId: certificate.id.value,
      certificateNumber: certificate.certificateNumber,
      certificateUrl: certificate.certificateUrl,
      issuedAt: certificate.issuedAt,
    };
  }

  async executeForPendingStudents(): Promise<void> {
    // TODO: Query enrollments completed but no cert yet, then execute() for each
  }
}
