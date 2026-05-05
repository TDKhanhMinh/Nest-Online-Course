import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { RegisterDto } from './register.dto';

export class RegisterInstructorDto extends RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Biography is required for instructor registration' })
  biography: string;

  @IsString()
  @IsNotEmpty({ message: 'Headline is required for instructor registration' })
  headline: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  youtube?: string;
}
