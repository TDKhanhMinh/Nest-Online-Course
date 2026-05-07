import { IsString, IsNumber, IsOptional, IsEnum, IsUrl, MinLength } from 'class-validator';
import { CourseLevel } from '@shared/types/course-level.enum';
import { CourseStatus } from '@shared/types/course-status.enum';

export class CreateCourseDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsString()
  language?: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}

export class CourseResponseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: CourseStatus;
  instructorId: string;
  categoryId: string;
  thumbnailUrl?: string;
  level: CourseLevel;
  language: string;
}



