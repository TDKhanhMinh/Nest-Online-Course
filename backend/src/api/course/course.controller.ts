import { CourseService } from '@/api/course/course.service';
import { CursorOptionsDto } from '@/common/pagination/cursor/cursor-options.dto';
import { PageOptionsDto } from '@/common/pagination/offset/page-options.dto';
import { Role } from '@/common/types/role.enum';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';
import { Roles } from '@/decorators/roles.decorator';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
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
import {
  CreateLessonDto,
  CreateSectionDto,
  UpdateLessonDto,
  UpdateSectionDto,
} from './dto/course-content.dto';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateReviewDto } from './dto/review.dto';

@Controller({
  path: 'courses',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('reviews')
  async createReview(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateReviewDto,
  ) {
    return this.courseService.createReview(user.sub, dto);
  }

  @Get(':courseId/reviews')
  async getReviews(@Param('courseId') courseId: string) {
    return this.courseService.getCourseReviews(courseId);
  }

  // --- Course Catalog ---

  @Get('offset')
  getCoursesWithOffset(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ) {
    return this.courseService.getAllWithOffset(pageOptionsDto);
  }

  @Get('cursor')
  getCoursesWithCursor(
    @Query(new ValidationPipe({ transform: true }))
    cursorOptionsDto: CursorOptionsDto,
  ) {
    return this.courseService.getAllWithCursor(cursorOptionsDto);
  }

  @Get(':courseId/content')
  getCourseFullContent(@Param('courseId') courseId: string) {
    return this.courseService.getCourseFullContent(courseId);
  }

  // --- Instructor Course Management ---

  @Post()
  @Roles(Role.INSTRUCTOR)
  createCourse(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCourseDto,
  ) {
    return this.courseService.createCourse(user.sub, dto);
  }

  @Get('instructor/my-courses')
  @Roles(Role.INSTRUCTOR)
  getMyCourses(
    @CurrentUser() user: JwtPayload,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ) {
    return this.courseService.getInstructorCourses(user.sub, pageOptionsDto);
  }

  @Put(':courseId')
  @Roles(Role.INSTRUCTOR)
  updateCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(user.sub, courseId, dto);
  }

  @Delete(':courseId')
  @Roles(Role.INSTRUCTOR)
  deleteCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.deleteCourse(user.sub, courseId);
  }

  @Get(':courseId/manage')
  @Roles(Role.INSTRUCTOR)
  async manageCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    // Reuse full content logic but could add more management-specific data here
    return this.courseService.getCourseFullContent(courseId);
  }

  // --- Content Management (Instructors) ---

  @Post(':courseId/sections')
  @Roles(Role.INSTRUCTOR)
  createSection(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateSectionDto,
  ) {
    return this.courseService.createSection(courseId, user.sub, dto);
  }

  @Put(':courseId/sections/:sectionId')
  @Roles(Role.INSTRUCTOR)
  updateSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.courseService.updateSection(courseId, user.sub, sectionId, dto);
  }

  @Delete(':courseId/sections/:sectionId')
  @Roles(Role.INSTRUCTOR)
  deleteSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.deleteSection(courseId, user.sub, sectionId);
  }

  @Post(':courseId/sections/:sectionId/lessons')
  @Roles(Role.INSTRUCTOR)
  createLesson(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateLessonDto,
  ) {
    return this.courseService.createLesson(courseId, user.sub, sectionId, dto);
  }

  @Put(':courseId/lessons/:lessonId')
  @Roles(Role.INSTRUCTOR)
  updateLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.courseService.updateLesson(courseId, user.sub, lessonId, dto);
  }

  @Delete(':courseId/lessons/:lessonId')
  @Roles(Role.INSTRUCTOR)
  deleteLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.courseService.deleteLesson(courseId, user.sub, lessonId);
  }

}
