import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateDocument, CertificateSchema } from '@/database/schemas/certificate.schema';
import { CertificateMongooseRepository } from './certificate.repository';
import { CertificateMapper } from './certificate.mapper';
import { ICERTIFICATE_REPOSITORY } from '@domain/certificate/ports/i-certificate.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CertificateDocument.name, schema: CertificateSchema },
    ]),
  ],
  providers: [
    { provide: ICERTIFICATE_REPOSITORY, useClass: CertificateMongooseRepository },
    CertificateMapper,
  ],
  exports: [ICERTIFICATE_REPOSITORY],
})
export class CertificatePersistenceModule {}
