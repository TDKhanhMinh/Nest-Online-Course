import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrUpdateQuizDto {
  // @ApiProperty({ description: 'ID of the lesson this quiz belongs to' })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  // @ApiProperty({ description: 'Title of the quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  // @ApiPropertyOptional({ description: 'Description of the quiz' })
  @IsString()
  @IsOptional()
  description?: string;

  // @ApiProperty({ description: 'Time limit in minutes', default: 30 })
  @IsNumber()
  @Min(1)
  timeLimit: number;

  // @ApiProperty({ description: 'Passing score percentage', default: 80 })
  @IsNumber()
  @Min(1)
  passingScore: number;

  // @ApiProperty({ description: 'Maximum allowed attempts', default: 3 })
  @IsNumber()
  @Min(1)
  maxAttempts: number;
}
