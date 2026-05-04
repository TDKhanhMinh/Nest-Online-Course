import { IsEmail, IsString, IsUUID } from 'class-validator';

export class EnrollStudentRequestDto {
  @IsUUID()
  courseId: string;

  @IsEmail()
  studentEmail: string;
}
