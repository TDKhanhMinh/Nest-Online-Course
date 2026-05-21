import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateQuizLessonIdDto {
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  @IsNotEmpty()
  lessonId!: string | null;
}
