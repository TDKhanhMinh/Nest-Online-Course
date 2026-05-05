import { IsEmail, IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { Role } from '@/common/types/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
