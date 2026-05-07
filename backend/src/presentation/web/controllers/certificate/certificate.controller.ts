import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { GetStudentCertificatesUseCase } from '@application/certificate/use-cases/get-student-certificates.use-case';

@Controller({
  path: 'certificates',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class CertificateController {
  constructor(
    private readonly getStudentCertificatesUseCase: GetStudentCertificatesUseCase,
  ) {}

  @Get('my')
  async getMyCertificates(@CurrentUser() user: JwtPayload) {
    const certs = await this.getStudentCertificatesUseCase.execute(user.sub);
    return certs.map((c) => ({
      certificateId: c.id,
      courseId: c.courseId,
      certificateNumber: c.certificateNumber,
      certificateUrl: c.certificateUrl,
      issuedAt: c.issuedAt,
    }));
  }
}
