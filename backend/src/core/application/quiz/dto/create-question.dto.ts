import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DifficultyLevel } from '../../../shared/types/difficulty-level.enum';
import { QuestionType } from '../../../shared/types/question-type.enum';

class QuestionOptionDto {
  
  @IsString()
  @IsNotEmpty()
  content: string;

  
  @IsBoolean()
  isCorrect: boolean;

  
  @IsString()
  @IsOptional()
  explanation?: string;
}

export class CreateQuestionDto {
  
  @IsString()
  @IsOptional()
  courseId?: string;

  
  @IsString()
  @IsNotEmpty()
  title: string;

  
  @IsString()
  @IsNotEmpty()
  content: string;

  
  @IsEnum(QuestionType)
  type: QuestionType;

  
  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options: QuestionOptionDto[];

  
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
