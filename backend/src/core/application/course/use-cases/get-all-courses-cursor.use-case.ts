import { Inject, Injectable } from '@nestjs/common';
import { 
  ICourseRepository, 
  ICOURSE_REPOSITORY 
} from '@domain/course/ports/i-course.repository';
import { CursorOptionsDto } from '@shared/pagination/cursor/cursor-options.dto';

@Injectable()
export class GetAllCoursesCursorUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
  ) {}

  async execute(cursorOptionsDto: CursorOptionsDto): Promise<any> {
    return this.courseRepo.findAllWithCursor(cursorOptionsDto);
  }
}
