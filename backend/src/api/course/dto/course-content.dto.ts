import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  title: string;

  @IsNumber()
  order: number;
}

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export enum LectureType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE'
}

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(LectureType)
  type: LectureType;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class UpdateLectureDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(LectureType)
  type?: LectureType;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
