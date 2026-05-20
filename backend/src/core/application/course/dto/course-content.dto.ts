import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class SectionResponseDto {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsString()
  @IsOptional()
  textContent?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isFreePreview?: boolean;
}

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsString()
  @IsOptional()
  textContent?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isFreePreview?: boolean;
}

export class LessonResponseDto {
  id: string;
  sectionId: string;
  title: string;
  contentUrl?: string;
  textContent?: string;
  type: string;
  orderIndex: number;
  duration?: number;
  isFreePreview: boolean;
}
