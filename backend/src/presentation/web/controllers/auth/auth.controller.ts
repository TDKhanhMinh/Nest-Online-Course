import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '@application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '@application/auth/use-cases/register.use-case';
import { RegisterInstructorUseCase } from '@application/auth/use-cases/register-instructor.use-case';
import { RegisterDto } from '@application/auth/dto/register.dto';
import { LoginDto } from '@application/auth/dto/login.dto';
import { RegisterInstructorDto } from '@application/auth/dto/register-instructor.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly registerInstructorUseCase: RegisterInstructorUseCase,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.registerUseCase.execute(registerDto);
  }

  @Post('register-instructor')
  async registerInstructor(@Body() dto: RegisterInstructorDto) {
    return this.registerInstructorUseCase.execute(dto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }
}



