import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateDocument, CertificateSchema } from '@/database/schemas/certificate.schema';
import { CertificateMongooseRepository } from '@/api/certificate/certificate.repository';
import { CertificateMapper } from '@/api/certificate/certificate.mapper';
import { S3FileStorageAdapter } from '@/libs/storage/s3-storage.service';
import { AutoIssueCertificateTask } from '@/background/tasks/auto-issue-certificate.task';
import { CertificateController } from '@/api/certificate/certificate.controller';
import { CertificateService } from '@/api/certificate/certificate.service';
import { OnCertificateIssuedHandler } from '@/api/certificate/events/on-certificate-issued.handler';
import { CERTIFICATE_REPOSITORY } from '@/common/abstractions/certificate.repository.interface';
import { FILE_STORAGE_SERVICE } from '@/common/abstractions/file-storage.service.interface';
import { EnrollmentModule } from '@/api/enrollment/enrollment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CertificateDocument.name, schema: CertificateSchema },
    ]),
    EnrollmentModule,
  ],
  controllers: [CertificateController],
  providers: [
    { provide: CERTIFICATE_REPOSITORY, useClass: CertificateMongooseRepository },
    { provide: FILE_STORAGE_SERVICE, useClass: S3FileStorageAdapter },
    CertificateMapper,
    CertificateService,
    OnCertificateIssuedHandler,
    AutoIssueCertificateTask,
  ],
  exports: [CertificateService],
})
export class CertificateModule { }
