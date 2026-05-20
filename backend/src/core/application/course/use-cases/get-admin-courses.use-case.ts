import { Inject, Injectable } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { AdminCourseQueryDto } from '../dto/admin-course-query.dto';
import { PageDto } from '@shared/pagination/offset/page.dto';
import { Course } from '@domain/course/entities/course.entity';

@Injectable()
export class GetAdminCoursesUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(queryDto: AdminCourseQueryDto): Promise<PageDto<Course>> {
    return this.courseRepo.findAdminCourses(queryDto);
  }
}
