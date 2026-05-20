import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { CourseStatus } from '@shared/types/course-status.enum';

export class InstructorCourseQueryDto extends PageOptionsDto {
  @IsEnum(CourseStatus)
  @IsOptional()
  readonly status?: CourseStatus;

  @IsString()
  @IsOptional()
  readonly search?: string;
}
