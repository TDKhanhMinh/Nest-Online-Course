import { CursorOptionsDto } from '@shared/pagination/cursor/cursor-options.dto';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { Role } from '@shared/types/role.enum';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
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
} from '@application/course/dto/course-content.dto';
import { CreateCourseDto, UpdateCourseDto } from '@application/course/dto/course.dto';
import { CreateReviewDto } from '@application/course/dto/review.dto';

// Use Cases
import { CreateReviewUseCase } from '@application/course/use-cases/create-review.use-case';
import { GetCourseReviewsUseCase } from '@application/course/use-cases/get-course-reviews.use-case';
import { GetAllCoursesOffsetUseCase } from '@application/course/use-cases/get-all-courses-offset.use-case';
import { GetAllCoursesCursorUseCase } from '@application/course/use-cases/get-all-courses-cursor.use-case';
import { GetCourseFullContentUseCase } from '@application/course/use-cases/get-course-full-content.use-case';
import { CreateCourseUseCase } from '@application/course/use-cases/create-course.use-case';
import { GetInstructorCoursesUseCase } from '@application/course/use-cases/get-instructor-courses.use-case';
import { UpdateCourseUseCase } from '@application/course/use-cases/update-course.use-case';
import { DeleteCourseUseCase } from '@application/course/use-cases/delete-course.use-case';
import { CreateSectionUseCase } from '@application/course/use-cases/create-section.use-case';
import { UpdateSectionUseCase } from '@application/course/use-cases/update-section.use-case';
import { DeleteSectionUseCase } from '@application/course/use-cases/delete-section.use-case';
import { CreateLessonUseCase } from '@application/course/use-cases/create-lesson.use-case';
import { UpdateLessonUseCase } from '@application/course/use-cases/update-lesson.use-case';
import { DeleteLessonUseCase } from '@application/course/use-cases/delete-lesson.use-case';

@Controller({
  path: 'courses',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getCourseReviewsUseCase: GetCourseReviewsUseCase,
    private readonly getAllCoursesOffsetUseCase: GetAllCoursesOffsetUseCase,
    private readonly getAllCoursesCursorUseCase: GetAllCoursesCursorUseCase,
    private readonly getCourseFullContentUseCase: GetCourseFullContentUseCase,
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly getInstructorCoursesUseCase: GetInstructorCoursesUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    private readonly deleteCourseUseCase: DeleteCourseUseCase,
    private readonly createSectionUseCase: CreateSectionUseCase,
    private readonly updateSectionUseCase: UpdateSectionUseCase,
    private readonly deleteSectionUseCase: DeleteSectionUseCase,
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly updateLessonUseCase: UpdateLessonUseCase,
    private readonly deleteLessonUseCase: DeleteLessonUseCase,
  ) {}

  @Post('reviews')
  async createReview(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateReviewDto,
  ) {
    return this.createReviewUseCase.execute(user.sub, dto);
  }

  @Get(':courseId/reviews')
  async getReviews(@Param('courseId') courseId: string) {
    return this.getCourseReviewsUseCase.execute(courseId);
  }

  // --- Course Catalog ---

  @Get('offset')
  getCoursesWithOffset(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ) {
    return this.getAllCoursesOffsetUseCase.execute(pageOptionsDto);
  }

  @Get('cursor')
  getCoursesWithCursor(
    @Query(new ValidationPipe({ transform: true }))
    cursorOptionsDto: CursorOptionsDto,
  ) {
    return this.getAllCoursesCursorUseCase.execute(cursorOptionsDto);
  }

  @Get(':courseId/content')
  getCourseFullContent(@Param('courseId') courseId: string) {
    return this.getCourseFullContentUseCase.execute(courseId);
  }

  // --- Instructor Course Management ---

  @Post()
  @Roles(Role.INSTRUCTOR)
  createCourse(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCourseDto,
  ) {
    return this.createCourseUseCase.execute(user.sub, dto);
  }

  @Get('instructor/my-courses')
  @Roles(Role.INSTRUCTOR)
  getMyCourses(
    @CurrentUser() user: JwtPayload,
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ) {
    return this.getInstructorCoursesUseCase.execute(user.sub, pageOptionsDto);
  }

  @Put(':courseId')
  @Roles(Role.INSTRUCTOR)
  updateCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.updateCourseUseCase.execute(user.sub, courseId, dto);
  }

  @Delete(':courseId')
  @Roles(Role.INSTRUCTOR)
  deleteCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.deleteCourseUseCase.execute(user.sub, courseId);
  }

  @Get(':courseId/manage')
  @Roles(Role.INSTRUCTOR)
  async manageCourse(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    // Reuse full content logic
    return this.getCourseFullContentUseCase.execute(courseId);
  }

  // --- Content Management (Instructors) ---

  @Post(':courseId/sections')
  @Roles(Role.INSTRUCTOR)
  createSection(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateSectionDto,
  ) {
    return this.createSectionUseCase.execute(courseId, user.sub, dto);
  }

  @Put(':courseId/sections/:sectionId')
  @Roles(Role.INSTRUCTOR)
  updateSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.updateSectionUseCase.execute(courseId, user.sub, sectionId, dto);
  }

  @Delete(':courseId/sections/:sectionId')
  @Roles(Role.INSTRUCTOR)
  deleteSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.deleteSectionUseCase.execute(courseId, user.sub, sectionId);
  }

  @Post(':courseId/sections/:sectionId/lessons')
  @Roles(Role.INSTRUCTOR)
  createLesson(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateLessonDto,
  ) {
    return this.createLessonUseCase.execute(courseId, user.sub, sectionId, dto);
  }

  @Put(':courseId/lessons/:lessonId')
  @Roles(Role.INSTRUCTOR)
  updateLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.updateLessonUseCase.execute(courseId, user.sub, lessonId, dto);
  }

  @Delete(':courseId/lessons/:lessonId')
  @Roles(Role.INSTRUCTOR)
  deleteLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.deleteLessonUseCase.execute(courseId, user.sub, lessonId);
  }
}
