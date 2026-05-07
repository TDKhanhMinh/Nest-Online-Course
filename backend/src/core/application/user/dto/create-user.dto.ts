import { Role } from '@shared/types/role.enum';

export class CreateUserDto {
  fullName: string;
  email: string;
  passwordHash: string;
  roles?: Role[];
}
