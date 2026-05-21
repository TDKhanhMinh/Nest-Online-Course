import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddQuestionToQuizDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsNumber()
  @Min(1)
  points: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  orderIndex?: number;
}

