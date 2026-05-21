import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateQuizDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lessonId?: string | null;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  timeLimit!: number;

  @IsNumber()
  @Min(1)
  passingScore!: number;

  @IsNumber()
  @Min(1)
  maxAttempts!: number;
}
