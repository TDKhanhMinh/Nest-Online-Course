import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';
import {
  CERTIFICATE_REPOSITORY,
  ICertificateRepository,
} from '@/common/abstractions/repositories/i-certificate.repository';
import { UniqueId } from '@/common/types/unique-id.vo';

@Controller({
  path: 'certificates',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CertificateController {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certRepo: ICertificateRepository,
  ) {}

  @Get('my')
  async getMyCertificates(@CurrentUser() user: JwtPayload) {
    const certs = await this.certRepo.findAllByStudent(new UniqueId(user.sub));
    return certs.map((c) => ({
      certificateId: c.id.value,
      courseId: c.courseId.value,
      certificateNumber: c.certificateNumber,
      certificateUrl: c.certificateUrl,
      issuedAt: c.issuedAt,
    }));
  }
}
