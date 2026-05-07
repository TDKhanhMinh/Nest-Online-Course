import { Inject, Injectable } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';

@Injectable()
export class AdminGetAllCoursesUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(pageOptions: any): Promise<any> {
    return this.courseRepo.findAdminCourses(pageOptions);
  }
}
