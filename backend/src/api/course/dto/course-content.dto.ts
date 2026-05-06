import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { LessonType } from '@/common/types/lesson-type.enum';

export class CreateSectionDto {
  @IsString()
  title: string;

  @IsNumber()
  orderIndex: number;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsEnum(LessonType)
  type: LessonType;

  @IsNumber()
  orderIndex: number;

  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsOptional()
  @IsString()
  textContent?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(LessonType)
  type?: LessonType;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsString()
  contentUrl?: string;

  @IsOptional()
  @IsString()
  textContent?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;
}
