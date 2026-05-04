import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateDocument, CertificateSchema } from './infrastructure/persistence/schemas/certificate.schema';
import { CertificateMongooseRepository } from './infrastructure/persistence/repositories/certificate.mongoose.repository';
import { CertificateMapper } from './infrastructure/persistence/mappers/certificate.mapper';
import { S3FileStorageAdapter } from './infrastructure/adapters/s3-file-storage.adapter';
import { AutoIssueCertificateScheduler } from './infrastructure/schedulers/auto-issue-certificate.scheduler';
import { CertificateController } from './presentation/certificate.controller';
import { IssueCertificateUseCase } from './application/use-cases/issue-certificate/issue-certificate.use-case';
import { OnCertificateIssuedHandler } from './application/event-handlers/on-certificate-issued.handler';
import { CERTIFICATE_REPOSITORY } from './domain/ports/certificate.repository.interface';
import { FILE_STORAGE_SERVICE } from './application/ports/file-storage.service.interface';
import { EnrollmentModule } from '../enrollment/enrollment.module';

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
    IssueCertificateUseCase,
    OnCertificateIssuedHandler,
    AutoIssueCertificateScheduler,
  ],
  exports: [IssueCertificateUseCase],
})
export class CertificateModule { }
