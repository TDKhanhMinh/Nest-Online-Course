import { IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { PageOptionsDto } from '@shared/pagination/offset/page-options.dto';
import { CourseStatus } from '@shared/types/course-status.enum';

export class AdminCourseFilterDto extends PageOptionsDto {
  @IsEnum(CourseStatus)
  @IsOptional()
  readonly status?: CourseStatus;
}

export class AdminUpdateCourseStatusDto {
  @IsEnum(CourseStatus)
  @IsNotEmpty()
  status: CourseStatus;
}



