import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateInstructorProfileDto {
  @IsString()
  biography: string;

  @IsString()
  headline: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  youtube?: string;
}

export class UpdateInstructorProfileDto {
  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  youtube?: string;
}
