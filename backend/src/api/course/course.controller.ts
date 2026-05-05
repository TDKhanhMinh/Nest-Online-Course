import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CourseService } from '@/api/course/course.service';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/common/types/role.enum';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';
import { PageOptionsDto } from '@/common/pagination/offset/page-options.dto';
import { CursorOptionsDto } from '@/common/pagination/cursor/cursor-options.dto';
import { CreateSectionDto, UpdateSectionDto, CreateLectureDto, UpdateLectureDto } from './dto/course-content.dto';
import { CreateReviewDto } from './dto/review.dto';

@Controller({
  path: 'courses',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @Post('reviews')
  async createReview(@CurrentUser() user: JwtPayload, @Body() dto: CreateReviewDto) {
    return this.courseService.createReview(user.sub, dto);
  }

  @Get(':courseId/reviews')
  async getReviews(@Param('courseId') courseId: string) {
    return this.courseService.getCourseReviews(courseId);
  }

  // --- Course Catalog ---

  @Get('offset')
  getCoursesWithOffset(
    @Query(new ValidationPipe({ transform: true })) pageOptionsDto: PageOptionsDto,
  ) {
    return this.courseService.getAllWithOffset(pageOptionsDto);
  }

  @Get('cursor')
  getCoursesWithCursor(
    @Query(new ValidationPipe({ transform: true })) cursorOptionsDto: CursorOptionsDto,
  ) {
    return this.courseService.getAllWithCursor(cursorOptionsDto);
  }

  @Get(':courseId/content')
  getCourseFullContent(@Param('courseId') courseId: string) {
    return this.courseService.getCourseFullContent(courseId);
  }

  // --- Content Management (Instructors) ---

  @Post(':courseId/sections')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  createSection(@Param('courseId') courseId: string, @Body() dto: CreateSectionDto) {
    return this.courseService.createSection(courseId, dto);
  }

  @Put('sections/:sectionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  updateSection(@Param('sectionId') sectionId: string, @Body() dto: UpdateSectionDto) {
    return this.courseService.updateSection(sectionId, dto);
  }

  @Delete('sections/:sectionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  deleteSection(@Param('sectionId') sectionId: string) {
    return this.courseService.deleteSection(sectionId);
  }

  @Post('sections/:sectionId/lectures')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  createLecture(@Param('sectionId') sectionId: string, @Body() dto: CreateLectureDto) {
    return this.courseService.createLecture(sectionId, dto);
  }

  @Put('lectures/:lectureId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  updateLecture(@Param('lectureId') lectureId: string, @Body() dto: UpdateLectureDto) {
    return this.courseService.updateLecture(lectureId, dto);
  }

  @Delete('lectures/:lectureId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  deleteLecture(@Param('lectureId') lectureId: string) {
    return this.courseService.deleteLecture(lectureId);
  }
}
