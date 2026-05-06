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
import { CourseService } from '@/api/course/course.service';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/common/types/role.enum';
import {
  AdminCourseFilterDto,
  AdminUpdateCourseStatusDto,
} from './dto/admin-course.dto';

@Controller({
  path: 'admin/courses',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getAllCourses(
    @Query(new ValidationPipe({ transform: true }))
    filterDto: AdminCourseFilterDto,
  ) {
    return this.courseService.adminGetAllCourses(filterDto);
  }

  @Get(':courseId')
  async getCourseDetail(@Param('courseId') courseId: string) {
    return this.courseService.getCourseFullContent(courseId);
  }

  @Patch(':courseId/status')
  async updateCourseStatus(
    @Param('courseId') courseId: string,
    @Body() dto: AdminUpdateCourseStatusDto,
  ) {
    return this.courseService.adminUpdateCourseStatus(courseId, dto.status);
  }

  @Delete(':courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    await this.courseService.adminDeleteCourse(courseId);
    return { message: 'Course deleted successfully' };
  }
}
