import { Inject, Injectable } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { InstructorCourseQueryDto } from '../dto/instructor-course-query.dto';

@Injectable()
export class GetInstructorCoursesUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(instructorId: string, query: InstructorCourseQueryDto): Promise<any> {
    return this.courseRepo.findByInstructorId(instructorId, query);
  }
}
