import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  parentId?: string | null;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  parentId?: string | null;
}

