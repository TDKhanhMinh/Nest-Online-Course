export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
}

export interface UpdateUserDto {
  fullName?: string;
  roles?: UserRole[];
  isActive?: boolean;
}

export interface UserPaginationResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}
