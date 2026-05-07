import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EnrollStudentRequestDto } from '@application/enrollment/dto/enroll-student.request.dto';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { EnrollStudentUseCase } from '@application/enrollment/use-cases/enroll-student.use-case';

@Controller({
  path: 'enrollments',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollStudentUseCase: EnrollStudentUseCase) {}

  @Post()
  enroll(@Body() dto: EnrollStudentRequestDto, @CurrentUser() user: JwtPayload) {
    return this.enrollStudentUseCase.execute({
      studentId:    user.sub,
      studentEmail: user.email,
      courseId:     dto.courseId,
    });
  }
}
