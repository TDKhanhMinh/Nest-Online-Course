import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@/common/types/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
