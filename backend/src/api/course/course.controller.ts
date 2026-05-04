import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from '@/api/course/course.service';
import { CompleteLessonRequestDto } from '@/api/course/dto/complete-lesson.request.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';
import { PageOptionsDto } from '@/common/pagination/offset/page-options.dto';
import { CursorOptionsDto } from '@/common/pagination/cursor/cursor-options.dto';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
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
    return this.courseService.completeLesson({
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
    return this.courseService.getCourseProgress({
      courseId,
      studentId: user.sub,
    });
  }

  /**
   * GET /courses/offset
   */
  @Get('offset')
  getCoursesWithOffset(
    @Query(new ValidationPipe({ transform: true })) pageOptionsDto: PageOptionsDto,
  ) {
    return this.courseService.getAllWithOffset(pageOptionsDto);
  }

  /**
   * GET /courses/cursor
   */
  @Get('cursor')
  getCoursesWithCursor(
    @Query(new ValidationPipe({ transform: true })) cursorOptionsDto: CursorOptionsDto,
  ) {
    return this.courseService.getAllWithCursor(cursorOptionsDto);
  }
}
