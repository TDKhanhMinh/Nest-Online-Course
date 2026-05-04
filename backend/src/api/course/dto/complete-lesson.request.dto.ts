import { IsNumber, Max, Min } from 'class-validator';

export class CompleteLessonRequestDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  quizScore: number;
}
