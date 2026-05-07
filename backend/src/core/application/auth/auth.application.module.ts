import { Module } from '@nestjs/common';
import { LoginUseCase } from './use-cases/login.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { RegisterInstructorUseCase } from './use-cases/register-instructor.use-case';

@Module({
  providers: [
    LoginUseCase,
    RegisterUseCase,
    RegisterInstructorUseCase,
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    RegisterInstructorUseCase,
  ],
})
export class AuthApplicationModule {}
