import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompleteLessonUseCase } from '../application/use-cases/complete-lesson/complete-lesson.use-case';
import { GetCourseProgressUseCase } from '../application/use-cases/get-course-progress/get-course-progress.use-case';
import { CompleteLessonRequestDto } from './dtos/complete-lesson.request.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/common/decorators/current-user.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(
    private readonly completeLessonUseCase: CompleteLessonUseCase,
    private readonly getCourseProgressUseCase: GetCourseProgressUseCase,
  ) {}

  /**
   * POST /courses/:courseId/lessons/:lessonId/complete
   * Controller chỉ trích xuất dữ liệu HTTP và delegate hoàn toàn cho Use Case.
   */
  @Post(':courseId/lessons/:lessonId/complete')
  @HttpCode(HttpStatus.OK)
  completeLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: CompleteLessonRequestDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.completeLessonUseCase.execute({
      courseId,
      lessonId,
      studentId: user.sub,
      score: dto.quizScore,
    });
  }

  /**
   * GET /courses/:courseId/progress
   */
  @Get(':courseId/progress')
  getCourseProgress(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.getCourseProgressUseCase.execute({
      courseId,
      studentId: user.sub,
    });
  }
}
