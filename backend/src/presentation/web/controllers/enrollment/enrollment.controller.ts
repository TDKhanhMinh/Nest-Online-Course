import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { EnrollStudentRequestDto } from '@application/enrollment/dto/enroll-student.request.dto';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { EnrollStudentUseCase } from '@application/enrollment/use-cases/enroll-student.use-case';
import { GetStudentEnrollmentsUseCase } from '@application/enrollment/use-cases/get-student-enrollments.use-case';
import { GetEnrollmentStatusUseCase } from '@application/enrollment/use-cases/get-enrollment-status.use-case';

@Controller({
  path: 'enrollments',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
    private readonly getStudentEnrollmentsUseCase: GetStudentEnrollmentsUseCase,
    private readonly getEnrollmentStatusUseCase: GetEnrollmentStatusUseCase,
  ) {}

  @Post()
  enroll(@Body() dto: EnrollStudentRequestDto, @CurrentUser() user: JwtPayload) {
    return this.enrollStudentUseCase.execute({
      studentId:    user.sub,
      studentEmail: user.email,
      courseId:     dto.courseId,
    });
  }

  @Get('my')
  getMyEnrollments(@CurrentUser() user: JwtPayload) {
    return this.getStudentEnrollmentsUseCase.execute(user.sub);
  }

  @Get('my/:courseId/status')
  getMyEnrollmentStatus(
    @CurrentUser() user: JwtPayload,
    @Param('courseId') courseId: string,
  ) {
    return this.getEnrollmentStatusUseCase.execute(user.sub, courseId);
  }
}
