import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class QuestionAnswerDto {
  // @ApiProperty({ description: 'ID of the question' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  // @ApiProperty({ type: [String], description: 'Selected option IDs for the question' })
  @IsArray()
  @IsString({ each: true })
  selectedOptionIds: string[];
}

export class SubmitQuizAttemptDto {
  // @ApiProperty({ type: [QuestionAnswerDto], description: 'List of answers provided by the student' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  answers: QuestionAnswerDto[];
}
