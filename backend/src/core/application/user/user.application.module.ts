import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { CreateInstructorProfileUseCase } from './use-cases/create-instructor-profile.use-case';
import { GetInstructorProfileUseCase } from './use-cases/get-instructor-profile.use-case';
import { UpdateInstructorProfileUseCase } from './use-cases/update-instructor-profile.use-case';

const useCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  CreateInstructorProfileUseCase,
  GetInstructorProfileUseCase,
  UpdateInstructorProfileUseCase,
];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class UserApplicationModule {}
