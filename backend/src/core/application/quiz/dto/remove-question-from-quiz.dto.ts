import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveQuestionFromQuizDto {
  // @ApiProperty({ description: 'ID of the quiz' })
  @IsString()
  @IsNotEmpty()
  quizId: string;

  // @ApiProperty({ description: 'ID of the question to remove' })
  @IsString()
  @IsNotEmpty()
  questionId: string;
}
