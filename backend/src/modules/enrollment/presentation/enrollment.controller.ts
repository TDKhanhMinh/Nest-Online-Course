import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnrollStudentUseCase } from '../application/use-cases/enroll-student.use-case';
import { EnrollStudentRequestDto } from './dtos/enroll-student.request.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/common/decorators/current-user.decorator';

@Controller('enrollments')
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
