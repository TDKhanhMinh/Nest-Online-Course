import { Module } from '@nestjs/common';
import { IssueCertificateUseCase } from './use-cases/issue-certificate.use-case';
import { GetStudentCertificatesUseCase } from './use-cases/get-student-certificates.use-case';
import { OnCertificateIssuedHandler } from './events/on-certificate-issued.handler';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';

const useCases = [
  IssueCertificateUseCase,
  GetStudentCertificatesUseCase,
];

@Module({
  imports: [InfrastructureModule],
  providers: [
    ...useCases,
    OnCertificateIssuedHandler,
  ],
  exports: [...useCases],
})
export class CertificateApplicationModule {}
