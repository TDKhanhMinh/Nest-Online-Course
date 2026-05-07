import { Module } from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { CertificateApplicationModule } from '@application/certificate/certificate.application.module';

@Module({
  imports: [CertificateApplicationModule],
  controllers: [CertificateController],
})
export class CertificateWebModule {}
