import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/common/decorators/current-user.decorator';
import { CertificateMongooseRepository } from '../infrastructure/persistence/repositories/certificate.mongoose.repository';
import { UniqueId } from '@/infrastructure/shared-kernel/value-objects/unique-id.vo';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
export class CertificateController {
  constructor(private readonly certRepo: CertificateMongooseRepository) {}

  @Get('my')
  async getMyCertificates(@CurrentUser() user: JwtPayload) {
    const certs = await this.certRepo.findAllByStudent(new UniqueId(user.sub));
    return certs.map((c) => ({
      certificateId:     c.id.value,
      courseId:          c.courseId.value,
      certificateNumber: c.certificateNumber,
      certificateUrl:    c.certificateUrl,
      issuedAt:          c.issuedAt,
    }));
  }
}
