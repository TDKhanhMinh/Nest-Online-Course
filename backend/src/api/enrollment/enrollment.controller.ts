import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnrollmentService } from '@/api/enrollment/enrollment.service';
import { EnrollStudentRequestDto } from '@/api/enrollment/dto/enroll-student.request.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  enroll(@Body() dto: EnrollStudentRequestDto, @CurrentUser() user: JwtPayload) {
    return this.enrollmentService.enrollStudent({
      studentId:    user.sub,
      studentEmail: user.email,
      courseId:     dto.courseId,
    });
  }
}
