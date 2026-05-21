import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddQuestionToQuizDto {
  // @ApiProperty({ description: 'ID of the quiz' })
  @IsString()
  @IsNotEmpty()
  quizId: string;

  // @ApiProperty({ description: 'ID of the question to add' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  // @ApiProperty({ description: 'Points assigned to this question', default: 1 })
  @IsNumber()
  @Min(1)
  points: number;
}
