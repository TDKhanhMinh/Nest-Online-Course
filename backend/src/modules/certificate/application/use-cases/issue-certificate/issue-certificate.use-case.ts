import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ICertificateRepository, CERTIFICATE_REPOSITORY } from '../../../domain/ports/certificate.repository.interface';
import { IFileStorageService, FILE_STORAGE_SERVICE } from '../../ports/file-storage.service.interface';
import { Certificate } from '../../../domain/entities/certificate.entity';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';
import { CertificateAlreadyIssuedException } from '../../../domain/exceptions/certificate-already-issued.exception';
import { IssueCertificateCommand } from './issue-certificate.command';
import { IssueCertificateResult } from './issue-certificate.result';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IssueCertificateUseCase {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certRepo: ICertificateRepository,

    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorage: IFileStorageService,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(cmd: IssueCertificateCommand): Promise<IssueCertificateResult> {
    const studentId = new UniqueId(cmd.studentId);
    const courseId  = new UniqueId(cmd.courseId);

    // Invariant: không cấp chứng chỉ trùng
    const existing = await this.certRepo.findByStudentAndCourse(studentId, courseId);
    if (existing) throw new CertificateAlreadyIssuedException(cmd.studentId, cmd.courseId);

    // Tạo số chứng chỉ duy nhất
    const certNumber = `CERT-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Upload PDF lên storage (qua port – không biết S3 hay Cloudinary)
    const pdfBuffer = Buffer.from(`Certificate ${certNumber}`); // Placeholder
    const certUrl   = await this.fileStorage.uploadFile(pdfBuffer, `${certNumber}.pdf`, 'application/pdf');

    // Tạo aggregate – domain event được emit bên trong entity
    const certificate = Certificate.issue(studentId, courseId, certNumber, certUrl);
    await this.certRepo.save(certificate);

    // Dispatch domain events
    for (const event of certificate.domainEvents) {
      await this.eventEmitter.emitAsync(event.constructor.name, event);
    }
    certificate.clearDomainEvents();

    return {
      certificateId:     certificate.id.value,
      certificateNumber: certificate.certificateNumber,
      certificateUrl:    certificate.certificateUrl,
      issuedAt:          certificate.issuedAt,
    };
  }

  /** Dùng cho Cron job: tìm học viên pending và cấp cert */
  async executeForPendingStudents(): Promise<void> {
    // TODO: Query enrollments completed but no cert yet, then execute() for each
  }
}
