import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { Role } from '@shared/types/role.enum';
import {
  AdminUpdateCourseStatusDto,
  AdminUpdateCourseCategoryDto,
} from '@application/course/dto/admin-course.dto';
import { AdminCourseQueryDto } from '@application/course/dto/admin-course-query.dto';
import { GetAdminCoursesUseCase } from '@application/course/use-cases/get-admin-courses.use-case';
import { GetCourseFullContentUseCase } from '@application/course/use-cases/get-course-full-content.use-case';
import { AdminUpdateCourseStatusUseCase } from '@application/course/use-cases/admin-update-course-status.use-case';
import { AdminUpdateCourseCategoryUseCase } from '@application/course/use-cases/admin-update-course-category.use-case';
import { AdminDeleteCourseUseCase } from '@application/course/use-cases/admin-delete-course.use-case';

@Controller({
  path: 'admin/courses',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCourseController {
  constructor(
    private readonly getAdminCoursesUseCase: GetAdminCoursesUseCase,
    private readonly getCourseFullContentUseCase: GetCourseFullContentUseCase,
    private readonly adminUpdateCourseStatusUseCase: AdminUpdateCourseStatusUseCase,
    private readonly adminUpdateCourseCategoryUseCase: AdminUpdateCourseCategoryUseCase,
    private readonly adminDeleteCourseUseCase: AdminDeleteCourseUseCase,
  ) {}

  @Get()
  async getAllCourses(
    @Query(new ValidationPipe({ transform: true }))
    queryDto: AdminCourseQueryDto,
  ) {
    return this.getAdminCoursesUseCase.execute(queryDto);
  }

  @Get(':courseId')
  async getCourseDetail(@Param('courseId') courseId: string) {
    return this.getCourseFullContentUseCase.execute(courseId);
  }

  @Patch(':courseId/status')
  async updateCourseStatus(
    @Param('courseId') courseId: string,
    @Body() dto: AdminUpdateCourseStatusDto,
  ) {
    return this.adminUpdateCourseStatusUseCase.execute(courseId, dto.status);
  }

  @Patch(':courseId/category')
  async updateCourseCategory(
    @Param('courseId') courseId: string,
    @Body() dto: AdminUpdateCourseCategoryDto,
  ) {
    return this.adminUpdateCourseCategoryUseCase.execute(courseId, dto.categoryId);
  }

  @Delete(':courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    await this.adminDeleteCourseUseCase.execute(courseId);
    return { message: 'Course deleted successfully' };
  }
}
