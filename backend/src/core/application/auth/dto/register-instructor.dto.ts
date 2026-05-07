import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

export class RegisterInstructorDto extends RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Biography is required for instructor registration' })
  biography: string;

  @IsString()
  @IsNotEmpty({ message: 'Headline is required for instructor registration' })
  headline: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  twitter?: string;

  @IsOptional()
  linkedin?: string;

  @IsOptional()
  youtube?: string;
}



