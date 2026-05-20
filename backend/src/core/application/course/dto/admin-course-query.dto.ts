import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { CourseStatus } from '@shared/types/course-status.enum';

export class AdminCourseQueryDto extends PageOptionsDto {
  @IsEnum(CourseStatus)
  @IsOptional()
  readonly status?: CourseStatus;

  @IsString()
  @IsOptional()
  readonly categoryId?: string;

  @IsString()
  @IsOptional()
  readonly instructorId?: string;
}
