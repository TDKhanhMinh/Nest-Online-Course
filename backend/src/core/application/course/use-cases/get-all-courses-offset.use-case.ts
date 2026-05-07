import { Inject, Injectable } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';

@Injectable()
export class GetAllCoursesOffsetUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(pageOptionsDto: PageOptionsDto): Promise<any> {
    return this.courseRepo.findAllWithOffset(pageOptionsDto);
  }
}
